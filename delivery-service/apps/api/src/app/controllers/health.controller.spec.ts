import { RMQService } from 'nestjs-rmq';
import { ServiceUnavailableException } from '@nestjs/common';
import { HealthController } from './health.controller';

describe('Health endpoints', () => {
  afterEach(() => jest.useRealTimers());
  const controller = (send: jest.Mock) => new HealthController({ send } as unknown as RMQService);
  it('liveness does not contact dependencies', () => {
    const send = jest.fn();
    expect(controller(send).live()).toEqual({ status: 'ok' });
    expect(send).not.toHaveBeenCalled();
  });
  it('accepts a working empty catalog and sets a bounded RPC timeout', async () => {
    const send = jest.fn().mockResolvedValue({ categories: [] });
    await expect(controller(send).ready()).resolves.toEqual({ status: 'ok', checks: { checkout: 'up' } });
    expect(send).toHaveBeenCalledWith(expect.any(String), {}, { timeout: 1500 });
  });
  it.each([undefined, {}, { categories: null }])('rejects invalid upstream response %p', async reply => {
    await expect(controller(jest.fn().mockResolvedValue(reply)).ready()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
  it('returns 503 without exposing dependency errors, and recovers', async () => {
    const check = controller(jest.fn().mockRejectedValueOnce(new Error('private database details')).mockResolvedValue({ categories: [] }));
    try { await check.ready(); throw new Error('Expected failure'); } catch (error) {
      expect(error.getStatus()).toBe(503);
      expect(JSON.stringify(error.getResponse())).not.toContain('private');
    }
    await expect(check.ready()).resolves.toMatchObject({ status: 'ok' });
  });
  it('bounds a hung initialization and shares the pending RPC across probes', async () => {
    jest.useFakeTimers();
    let finish: (value: unknown) => void;
    const send = jest.fn(() => new Promise(resolve => { finish = resolve; }));
    const check = controller(send);
    const results = Promise.allSettled([check.ready(), check.ready()]);
    await jest.advanceTimersByTimeAsync(2000);
    expect((await results).every(result => result.status === 'rejected')).toBe(true);
    expect(send).toHaveBeenCalledTimes(1);
    const recovery = check.ready();
    finish({ categories: [] });
    await expect(recovery).resolves.toMatchObject({ status: 'ok' });
    expect(send).toHaveBeenCalledTimes(1);
  });
});
