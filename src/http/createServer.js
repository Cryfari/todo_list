
const Hapi = require('@hapi/hapi');

const logger = require('../log/logger');

const ClientError = require('../exceptions/ClientError');
const InvariantError = require('../exceptions/InvariantError');

const todos = require('../api/todos');
const TodosService = require('../services/postgres/TodosService');
const TodosValidator = require('../validator/todos');

const createServer = async (pool, nanoid) => {
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
  logger.info('Plugin registered')

  server.ext('onPreResponse', (request, h) => {
    const {response} = request;
    const requestId = request.info.id;

    if (response instanceof Error) {
      logger.error({requestId, error: response}, 'Server detected an error');

      if (response instanceof ClientError) {
        if (response instanceof InvariantError) {
          logger.error({requestId, error: response}, 'InvarianError');
          const newResponse = h.response({
            errors: response.errors,
          });
          newResponse.code(response.statusCode);
          return newResponse;
        }

        logger.error({requestId,message: response.message, error: response}, 'ClientError');
        const newResponse = h.response({
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        logger.error({requestId, error: response}, 'ServerError');
        const newResponse = h.response({
          message: response.message,
        });
        newResponse.code(404);
        return newResponse;
      }
      logger.error({ requestId, error: response }, 'ServerError: Internal server error!');
      console.log(response);
      const newResponse = h.response({
        message: 'Internal server error!',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });
  server.events.on('start', () => {
    logger.info(`server start at ${server.info.uri}`);
  });

  //log ketika server stop
  server.events.on('stop', () => {
    logger.info('Server stopped');
  });
  return server;
};

module.exports = createServer;