const Joi = require('joi');

const PostTodoPayloadSchema = Joi.object({
  title: Joi.string().max(50).required().error(message),
  description: Joi.string().required().error(message),
  due_date: Joi.date().iso().min(new Date()).required().error(message),
  priority: Joi.string().valid('low', 'medium', 'high').required().error(message),
});

function message(errors) { 
  errors.forEach(err => {
    console.log(err);
    switch (err.code) {
      case "string.empty":
        err.message = "Value should not be empty!";
        break;
      case "string.base":
        err.message = "Value should be a string!";
        break;
      case "date.min":
        err.message = "Value should be a time after now!";
        break;
      case "string.max":
        err.message = `Value should have at most ${err.local.limit} characters!`;
        break;
      case "any.required":
        err.message = "Value is required!";
        break;
      case "any.only":
        err.message = "Value should be one of low, medium, high!";
        break;
      default:
        break;
    }
  });
  return errors;
}

module.exports = { PostTodoPayloadSchema };