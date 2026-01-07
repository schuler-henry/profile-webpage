export class UnauthorizedError extends Error {
  /**
   * @inheritDoc
   */
  public readonly name: string = 'UnauthorizedError';

  public constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}
