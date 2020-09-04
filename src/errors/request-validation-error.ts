import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
export class RequestValidationError extends CustomError {
  statusCode = 422;
  constructor(public errors: ValidationError[]) {
    super('invalid request parameters');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map(({ msg, param }) => {
      return { message: msg, field: param };
    });
  }
}
