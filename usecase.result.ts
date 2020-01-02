export class UseCaseResult {
  readonly success: boolean;

  constructor(success: boolean) {
    this.success = success;
  }

  public dispose(): void {
  }
}
