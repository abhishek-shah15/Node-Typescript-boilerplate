export class UnexpectedInput extends Error {
  constructor(public message: string, public httpStatusCode: number = 500) {
    super(message);
    this.name = "UnexpectedInput";
  }
}
export class InvalidInput extends Error {
  // public httpStatusCode = 500
  constructor(public message: string, public httpStatusCode: number = 500) {
    super(message);
    this.name = "InvalidInput";
  }
}

export class JSONParseError extends SyntaxError {
  status?: number;
}
