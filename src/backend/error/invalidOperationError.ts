export class InvalidOperationError extends Error {
  /**
   * @inheritDoc
   */
  public readonly name: string = 'InvalidOperationError';

  public constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}
