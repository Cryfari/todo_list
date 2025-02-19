const{TodoPayloadSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');
const logger = require('../../log/logger');

const TodosValidator = {
  validateTodoPayload: (payload) => {
    const validationResult = TodoPayloadSchema.validate(payload, {abortEarly: false});
    if (validationResult.error) {
      const errors = {};
      validationResult.error.details.forEach(detail => {
        errors[detail.context.key] = detail.message;
      });
      logger.error({errors}, 'Payload not valid');
      throw new InvariantError(errors);
    }
  },
};

module.exports = TodosValidator;