const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/todos',
    handler: handler.postTodoHandler,
  },
  {
    method: 'GET',
    path: '/api/todos/{id}',
    handler: handler.getTodoByIdHandler,
  },
  {
    method: 'GET',
    path: '/api/todos',
    handler: handler.getTodosHandler,
  },
  {
    method: 'PATCH',
    path: '/api/todos/{id}',
    handler: handler.patchCompleteTodoByIdHandler,
  }
];

module.exports = routes;