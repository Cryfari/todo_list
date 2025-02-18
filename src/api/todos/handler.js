const autoBind = require('auto-bind');

class TodosHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postTodoHandler(request, h) {
      this._validator.validatePostTodoPayload(request.payload);

      const todoId = await this._service.addTodo(request.payload);

      const response = h.response({
        data: {
          todoId,
        },
      });
      response.code(201);
      return response;
  }
}

module.exports = TodosHandler;