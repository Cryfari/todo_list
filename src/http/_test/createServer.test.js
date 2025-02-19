const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const {nanoid} = require('nanoid');

describe('HTTP Server', () => {
  it('should response 404 when route not found', async () => {
    const server = await createServer(pool, nanoid);
    const response = await server.inject({
      method: 'GET',
      url: '/unexist-route',
    });

    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    const requestPayload = {
      title: 'new todo',
      description: 'new description',
      due_date: '2090-08-08',
      priority: 'low',
    };
    const server = await createServer(pool, {});
    const response = await server.inject({
      method: 'POST',
      url: '/api/todos',
      payload: requestPayload,
    });
    const responseJson = JSON.parse(response.payload);

    expect(response.statusCode).toEqual(500);
    expect(responseJson.message).toEqual('Internal server error!');
  });
});