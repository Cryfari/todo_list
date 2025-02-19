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
  },
  {
    method: 'PUT',
    path: '/api/todos/{id}',
    handler: handler.putTodoByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/api/todos/{id}',
    handler: handler.deleteTodoByIdHandler,
  }
];

module.exports = routes;