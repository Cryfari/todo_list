const autoBind = require('auto-bind');
const logger = require('../../log/logger');

class TodosHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postTodoHandler(request, h) {
      const requestId = request.info.id;
      logger.info({requestId, method: request.method, path: request.path},'Request received');
      this._validator.validateTodoPayload(request.payload);
      logger.debug({ requestId, payload: request.payload }, 'Payload valid');

      const todoId = await this._service.addTodo(request.payload);
      logger.info({ requestId, todoId }, 'Successfully added todo');
      const response = h.response({
        data: {
          todoId,
        },
      });
      response.code(201);
      logger.debug({ requestId, statusCode: response.statusCode }, 'Response: Todo created');
      return response;
  }

  async getTodoByIdHandler(request) {
    const requestId = request.info.id;
    logger.info({requestId, method: request.method, path: request.path}, 'Request received');
    const {id} = request.params;
    const todo = await this._service.getTodoById(id);
    logger.debug({requestId, todo}, 'Successfully get todo');

    const response = {
      data: {
        todo,
      },
    };

    logger.debug({requestId, response}, 'Response: Todo details');
    return response;
  }

  async getTodosHandler(request) {
    const requestId = request.info.id;
    logger.info({requestId, method: request.method, path: request.path}, 'Request received');
    const todos = await this._service.getTodos();
    logger.debug({requestId, todos}, 'Successfully get todos');
    const response = {
      data: todos
    };
    logger.debug({requestId, response}, 'Response: Todos list');
    return response;
  }

  async patchCompleteTodoByIdHandler(request) {
    const requestId = request.info.id;
    logger.info({requestId, method: request.method, path: request.path}, 'Request received');
    const {id} = request.params;
    const result = await this._service.completeTodoById(id);
    logger.debug({requestId, result}, 'Successfully complete todo');

    const response = {
      data: {
        id: result,
      },
    };
    logger.debug({requestId, response}, 'Response: Todo completed');
    return response;
  }

  async putTodoByIdHandler(request) {
    const requestId = request.info.id;
    logger.info({requestId, method: request.method, path: request.path}, 'Request received');
    this._validator.validateTodoPayload(request.payload);
    logger.debug({requestId, payload: request.payload}, 'Payload valid');

    const {id} = request.params;
    const result = await this._service.updateTodoById(id, request.payload);
    logger.debug({requestId, result}, 'Successfully update todo');
    const response = {
      data: {
        id: result,
      },
    };
    logger.debug({requestId, response}, 'Response: Todo updated');
    return response;
  }

  async deleteTodoByIdHandler(request) {
    const requestId = request.info.id;
    logger.info({requestId, method: request.method, path: request.path}, 'Request received');
    const {id} = request.params;
    await this._service.deleteTodoById(id);
    logger.debug({requestId, id}, 'Successfully delete todo');

    const response = {
      data: {
        message: 'Todo deleted successfully',
      },
    };
    logger.debug({requestId, response}, 'Response: Todo deleted');
    return response;
  }
}

module.exports = TodosHandler;