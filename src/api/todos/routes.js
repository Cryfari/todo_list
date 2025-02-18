const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/todos',
    handler: handler.postTodoHandler,
  }
];

module.exports = routes;