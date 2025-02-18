const pool = require('../../database/postgres/pool');
const TodosTableTestHelper = require('../../helper/TodosTableHelper');
const createServer = require('../createServer');

describe('when POST /todos', () => {

  beforeAll(async () => {
    await TodosTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await TodosTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await TodosTableTestHelper.cleanTable();
  });

  describe('when POST /todos', () => {
    it('should response 201 and persisted todo', async () => {
      const requestPayload = {
        title: 'new todo',
        description: 'new description',
        due_date: '2090-08-08',
        priority: 'low',
      };
      const server = await createServer();
      const response = await server.inject({
        method: 'POST',
        url: '/api/todos',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.todoId).toBeDefined();
      expect(typeof responseJson.data.todoId).toBe('string');
    });
  });
});