const pool = require('../../database/postgres/pool');
const TodosTableTestHelper = require('../../helper/TodosTableHelper');
const createServer = require('../createServer');
const badPayload = [
  {
    title: 'new todo',
    description: 'new description',
    due_date: '2090-08-08',
  },
  {
    title: '',
    description: 'new description',
    due_date: '2090-08-08',
    priority: 'low',
  },
  {
    title: 123,
    description: 'new description',
    due_date: '2090-08-08',
    priority: 'low',
  },
  {
    title: 'new todo',
    description: 'new description',
    due_date: '2000-08-08',
    priority: 'low',
  },
  {
    title: 'new todonew todonew todonew todonew todonew todonew todonew todonew todo',
    description: 'new description',
    due_date: '2000-08-08',
    priority: 'low',
  },
  {
    title: 'new todo',
    description: 'new description',
    due_date: '2090-08-08',
    priority: 'end',
  },
  {
    title: 'new todo',
    description: 'new description',
    due_date: 'invalid_date',
    priority: 'low',
  }
]
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

  it('should response 400 when add todo with bad payload', async () => {
    const server = await createServer();
    for (let i = 0; i < badPayload.length; i++) {
      const response = await server.inject({
        method: 'POST',
        url: '/api/todos',
        payload: badPayload[i],
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(typeof responseJson.errors).toBe('object');
    }
  });
});