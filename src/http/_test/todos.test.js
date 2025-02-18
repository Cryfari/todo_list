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
describe('/api/todos enpoint', () => {

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

  describe('when POST /api/todos', () => {
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
  describe('when GET /api/todos', () => {
    it('should response 200 and return all todos', async () => {
      const server = await createServer();
      await TodosTableTestHelper.addTodo({
        id: 'todo-123',
        title: 'new todo',
        description: 'new description',
        due_date: '2090-08-08',
        priority: 'low',
      });
      await TodosTableTestHelper.addTodo({
        id: 'todo-124',
        title: 'new todo',
        description: 'new description',
        due_date: '2090-08-08',
        priority: 'low',
      });
      const response = await server.inject({
        method: 'GET',
        url: '/api/todos',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data).toHaveLength(2);
    });
  });
  describe('when GET /api/todos/{id}', () => {
    it('should response 200 and return todo by id', async () => {
      const server = await createServer();
      await TodosTableTestHelper.addTodo({
        id: 'todo-123',
        title: 'new todo',
        description: 'new description',
        due_date: '2090-08-08',
        priority: 'low',
      });
      await TodosTableTestHelper.addTodo({
        id: 'todo-124',
        title: 'new todo',
        description: 'new description',
        due_date: '2090-08-08',
        priority: 'low',
      });
      const response = await server.inject({
        method: 'GET',
        url: '/api/todos/todo-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.todo).toBeDefined();
    });
    it('should response 404 when todo not found', async () => {
      const server = await createServer();
      const response = await server.inject({
        method: 'GET',
        url: '/api/todos/todo-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Todo not found');
    });
  });

  describe('when PATCH /api/todos/{id}', () => {
    it('should response 200 and return todo id', async () => {
      const server = await createServer();
      await TodosTableTestHelper.addTodo({
        id: 'todo-123',
        title: 'new todo',
        description: 'new description',
        due_date: '2090-08-08',
        priority: 'low',
      });
      const response = await server.inject({
        method: 'PATCH',
        url: '/api/todos/todo-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.id).toBeDefined();
    });
    it('should response 404 when todo not found', async () => {
      const server = await createServer();
      const response = await server.inject({
        method: 'PATCH',
        url: '/api/todos/todo-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Todo not found');
    });
  });
  describe('when PUT /api/todos/{id}', () => {
    it('should response 200 and return todo id', async () => {
      const server = await createServer();
      await TodosTableTestHelper.addTodo({
        id: 'todo-123',
        title: 'new todo',
        description: 'new description',
        due_date: '2090-08-08',
        priority: 'low',
      });
      const requestPayload = {
        title: 'new todo',
        description: 'new description',
        due_date: '2090-08-08',
        priority: 'low',
      };
      const response = await server.inject({
        method: 'PUT',
        url: '/api/todos/todo-123',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.id).toBeDefined();
    });
    it('should response 400 when add todo with bad payload', async () => {
      const server = await createServer();
      await TodosTableTestHelper.addTodo({
        id: 'todo-123',
        title: 'new todo',
        description: 'new description',
        due_date: '2090-08-08',
        priority: 'low',
      });
      for (let i = 0; i < badPayload.length; i++) {
        const response = await server.inject({
          method: 'PUT',
          url: '/api/todos/todo-123',
          payload: badPayload[i],
        });
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(typeof responseJson.errors).toBe('object');
      }
    });
    it('should response 404 when todo not found', async () => {
      const requestPayload = {
        title: 'new todo',
        description: 'new description',
        due_date: '2090-08-08',
        priority: 'low',
      };
      const server = await createServer();
      const response = await server.inject({
        method: 'PUT',
        url: '/api/todos/todo-123',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Todo not found');
    });
  });
});