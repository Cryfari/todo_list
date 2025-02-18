const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(errors) {
    super();
    this.name = 'InvariantError';
    this.errors = errors;
  }
}

module.exports = InvariantError;
