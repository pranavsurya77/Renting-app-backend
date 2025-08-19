class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any,
    public stack?: string,
    public success: boolean = false
  ) {
    super(message);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };