const assert = require('node:assert/strict');
const { readFile, writeFile } = require('node:fs/promises');
const { createHash, randomUUID } = require('node:crypto');
const { setTimeout: delay } = require('node:timers/promises');
const sharp = require('../delivery-service/node_modules/sharp');
const base = 'http://127.0.0.1:3444';
const [mode = 'write', proofFile, driver = 's3'] = process.argv.slice(2);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

async function main() {
  assert(proofFile && ['write', 'read'].includes(mode), 'Usage: node scripts/smoke-storage.cjs write|read PROOF_FILE [local|s3]');
  let proof;
  if (mode === 'write') {
    const empty = await fetch(`${base}/api/files/upload`, {method:'POST',body:new FormData(),signal:AbortSignal.timeout(5000)});
    assert.equal(empty.status, 400, 'Missing file must be rejected');
    const forged = new FormData();
    forged.append('file', new Blob(['not an image'], {type:'image/png'}), 'forged.png');
    const rejected = await fetch(`${base}/api/files/upload`, {method:'POST',body:forged,signal:AbortSignal.timeout(5000)});
    assert.equal(rejected.status, 400, 'MIME spoofing must be rejected');
    if (driver === 's3') {
      const missing = await fetch(`${base}/api/media/s3/2099-01-01/${randomUUID()}.png`, {signal:AbortSignal.timeout(10000)});
      assert.equal(missing.status, 404);
      assert(!(missing.headers.get('cache-control') || '').includes('immutable'), 'Errors must not be cached as immutable media');
    }
    const bytes = await sharp({create:{width:2,height:2,channels:3,background:'#3574ff'}}).png().toBuffer();
    const form = new FormData();
    form.append('file', new Blob([bytes], {type:'image/png'}), 'smoke.png');
    const response = await fetch(`${base}/api/files/upload`, {method:'POST',body:form,signal:AbortSignal.timeout(30000)});
    assert.equal(response.status, 201, 'Upload failed');
    const {url} = await response.json();
    assert(url.startsWith(driver === 's3' ? '/api/media/s3/' : '/uploads/'), 'Unexpected storage driver');
    proof = {url, hash:digest(bytes)};
    await writeFile(proofFile, JSON.stringify(proof));
  } else proof = JSON.parse(await readFile(proofFile, 'utf8'));
  assert(/^\/(uploads|api\/media\/s3)\//.test(proof.url), 'Unexpected proof URL');
  let error;
  for (let attempt=0; attempt<30; attempt++) {
    try {
      const response = await fetch(`${base}${proof.url}`, {signal:AbortSignal.timeout(5000)});
      assert.equal(response.status,200);
      assert.equal(response.headers.get('content-type'),'image/png');
      assert.equal(digest(Buffer.from(await response.arrayBuffer())),proof.hash);
      console.log(`PASS ${mode}: image bytes match ${proof.url}`);
      return;
    } catch (e) {error=e; await delay(1000);}
  }
  throw error;
}
main().catch(error => {console.error(error);process.exitCode=1;});
