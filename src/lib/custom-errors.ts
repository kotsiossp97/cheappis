export class AuthError extends Error {
  errorSlug: string;
  constructor(errorSlug: string, message?: string) {
    super(message);
    this.errorSlug = errorSlug;
  }
}
