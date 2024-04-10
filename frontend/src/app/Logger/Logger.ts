/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */

// class GraylogTransport extends Transport {
//   log(info: any, callback: () => void) {
//     setImmediate(() => {
//       this.emit('logged', info);
//     });

//     callRestGraylog(info);
//     callback();
//   }
// }

const consoleLogger = {
  crit: (message: string) => console.error(message),
  error: (message: string) => console.error(message),
  info: (message: string) => console.info(message),
  debug: (message: string) => console.log(message),
};

interface ILogger {
  crit: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  debug: (message: string) => void;
}

class Logger implements ILogger {
  private logger;

  constructor() {
    this.logger = consoleLogger;
  }

  public async crit(message: string) {
    await this.logger.crit(message);
  }

  public async error(message: string) {
    await this.logger.error(message);
  }

  public async info(message: string) {
    await this.logger.info(message);
  }

  public async debug(message: string) {
    await this.logger.debug(message);
  }
}

export const logger = new Logger();
