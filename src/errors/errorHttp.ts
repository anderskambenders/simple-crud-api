export class ErrorHttp extends Error {
  public statusCode: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'HTTPError';
    this.statusCode = code;
  }
}

export default ErrorHttp;