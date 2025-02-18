require('dotenv').config();
const Hapi = require('@hapi/hapi');

const pool = require('../database/postgres/pool');

const {nanoid} = require('nanoid');

const ClientError = require('../exceptions/ClientError');

const todos = require('../api/todos');
const TodosService = require('../services/postgres/TodosService');
const TodosValidator = require('../validator/todos');

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  todosService = new TodosService(pool, nanoid);

  await server.register({
    plugin: todos,
    options: {
      service: todosService,
      validator: TodosValidator,
    },
  });
  

  server.ext('onPreResponse', (request, h) => {
    const {response} = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          errors: response.errors,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      console.log(response);
      const newResponse = h.response({
        message: 'Internal server error!',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  return server;
};

module.exports = createServer;