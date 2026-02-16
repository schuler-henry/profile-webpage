export class DatabaseError extends Error {
  /**
   * @inheritDoc
   */
  public readonly name: string = 'DatabaseError';

  public constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}
