const autoBind = require('auto-bind');

class TodosHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postTodoHandler(request, h) {
      this._validator.validateTodoPayload(request.payload);

      const todoId = await this._service.addTodo(request.payload);

      const response = h.response({
        data: {
          todoId,
        },
      });
      response.code(201);
      return response;
  }

  async getTodoByIdHandler(request) {
    const {id} = request.params;
    const todo = await this._service.getTodoById(id);
    return {
      data: {
        todo,
      },
    };
  }

  async getTodosHandler() {
    const todos = await this._service.getTodos();
    return {
      data: todos,
    };
  }

  async patchCompleteTodoByIdHandler(request) {
    const {id} = request.params;
    const result = await this._service.completeTodoById(id);
    return {
      data: {
        id: result,
      },
    };
  }
}

module.exports = TodosHandler;