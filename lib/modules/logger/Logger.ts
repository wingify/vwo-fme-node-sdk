export abstract class Logger {
  abstract trace(message: string): void;
  abstract debug(message: string): void;
  abstract info(message: string): void;
  abstract warn(message: string): void;
  abstract error(message: string): void;
}
