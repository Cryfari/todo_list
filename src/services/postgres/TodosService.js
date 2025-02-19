
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

const logger = require('../../log/logger');

class TodosService {
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addTodo({title, description, due_date, priority}) {
    const serviceLogger = logger.child({ service: 'TodosService', method: 'addTodo' });
    const id = `todo-${this._idGenerator(10)}`;

    const query = {
      text: 'INSERT INTO todos VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, title, description, due_date, priority],
    };

    serviceLogger.debug({ query }, 'Query to database');
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      serviceLogger.error('Todo failed to add');
      throw new ClientError('Todo failed to add');
    }
    serviceLogger.info({ todoId: result.rows[0].id, title, description, due_date, priority }, 'Successfully added todo');
    return result.rows[0].id;
  }

  async getTodoById(id) {
    const serviceLogger = logger.child({ service: 'TodosService', method: 'getTodoById' });
    const query = {
      text: 'SELECT id, title, description, due_date, priority, is_completed FROM todos WHERE id = $1 AND is_deleted = false',
      values: [id],
    };
    serviceLogger.debug({ query }, 'Query to database');
    const result = await this._pool.query(query);

    if(!result.rows.length) {
      serviceLogger.error({ id }, 'Todo not found');
      throw new NotFoundError('Todo not found');
    }
    serviceLogger.info({ todo: result.rows[0] }, 'Successfully get todo');
    return result.rows[0]
  }

  async getTodos() {
    const serviceLogger = logger.child({ service: 'TodosService', method: 'getTodos' });
    const query = {
      text: 'SELECT id, title, description, due_date, priority, is_completed FROM todos WHERE is_deleted = false',
    };
    serviceLogger.debug({ query }, 'Query to database');
    const result = await this._pool.query(query);
    serviceLogger.info({ todos: result.rows }, 'Successfully get todos');
    return result.rows;
  }

  async completeTodoById(id) {
    const serviceLogger = logger.child({ service: 'TodosService', method: 'completeTodoById' });
    const query = {
      text: 'UPDATE todos SET is_completed = true WHERE id = $1 AND is_deleted = false RETURNING id',
      values: [id],
    };
    serviceLogger.debug({ query }, 'Query to database');
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      serviceLogger.error({ id }, 'Todo not found');
      throw new NotFoundError('Todo not found');
    }
    serviceLogger.info({ todoId: result.rows[0].id }, 'Successfully complete todo');
    return result.rows[0].id;
  }

  async updateTodoById(id, {title, description, due_date, priority}) {
    const serviceLogger = logger.child({ service: 'TodosService', method: 'updateTodoById' });
    const query = {
      text: 'UPDATE todos SET title = $1, description = $2, due_date = $3, priority = $4 WHERE id = $5 AND is_deleted = false RETURNING id',
      values: [title, description, due_date, priority, id],
    };
    serviceLogger.debug({ query }, 'Query to database');
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      serviceLogger.error({ id }, 'Todo not found');
      throw new NotFoundError('Todo not found');
    }
    serviceLogger.info({ todoId: result.rows[0].id, title, description, due_date, priority }, 'Successfully update todo');
    return result.rows[0].id;
  }

  async deleteTodoById(id) {
    const serviceLogger = logger.child({ service: 'TodosService', method: 'deleteTodoById' });
    const query = {
      text: 'UPDATE todos SET is_deleted = true WHERE id = $1 AND is_deleted = false RETURNING id',
      values: [id],
    };
    serviceLogger.debug({ query }, 'Query to database');
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      serviceLogger.error({ id }, 'Todo not found');
      throw new NotFoundError('Todo not found');
    }
    serviceLogger.info({ todoId: result.rows[0].id }, 'Successfully delete todo');
  }
}

module.exports = TodosService;