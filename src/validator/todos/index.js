const{TodoPayloadSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const TodosValidator = {
  validateTodoPayload: (payload) => {
    const validationResult = TodoPayloadSchema.validate(payload, {abortEarly: false});
    if (validationResult.error) {
      const errors = {};
      validationResult.error.details.forEach(detail => {
        errors[detail.context.key] = detail.message;
      });
      throw new InvariantError(errors);
    }
  },
};

module.exports = TodosValidator;