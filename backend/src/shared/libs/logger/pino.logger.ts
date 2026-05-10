import { injectable } from "inversify";
import { Logger as PinoInstance, pino, transport } from "pino";
import { resolve } from "node:path";
import { ILogger } from "./logger.interface.js";
import { getCurrentModuleDirrectoryPath } from "../../utils/index.js";

@injectable()
export class PinoLogger implements ILogger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentModuleDirrectoryPath();
    const logFilePath = "logs/backend.log";
    const destination = resolve(modulePath, "../../../", logFilePath);

    const multiTransport = transport({
      targets: [
        {
          target: "pino/file",
          options: { destination, mkdir: true },
          level: "debug",
        },
        {
          target: "pino/file",
          options: {},
          level: "info",
        },
      ],
    });

    this.logger = pino({}, multiTransport);
    this.logger.info("Logger created!");
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info({ args }, message);
  }
  warn(message: string, ...args: unknown[]): void {
    this.logger.warn({ args }, message);
  }
  error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error({ error, args }, message);
  }
  debug(message: string, ...args: unknown[]): void {
    this.logger.debug({ args }, message);
  }
}
