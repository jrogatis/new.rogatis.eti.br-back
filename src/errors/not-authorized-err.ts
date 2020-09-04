import { CustomError } from './custom-error';

export class NotAuthorizedErr extends CustomError {
  statusCode = 401;
  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, NotAuthorizedErr.prototype);
  }

  serializeErrors() {
    return [
      {
        message: 'Not Authorized',
      },
    ];
  }
}
