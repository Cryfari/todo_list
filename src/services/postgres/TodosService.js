
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class TodosService {
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addTodo({title, description, due_date, priority}) {
    const id = `todo-${this._idGenerator(10)}`;

    const query = {
      text: 'INSERT INTO todos VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, title, description, due_date, priority],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new ClientError('Todo failed to add');
    }

    return result.rows[0].id;
  }

  async getTodoById(id) {
    const query = {
      text: 'SELECT id, title, description, due_date, priority, is_completed FROM todos WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await this._pool.query(query);

    if(!result.rows.length) {
      throw new NotFoundError('Todo not found');
    }
    return result.rows[0]
  }

  async getTodos() {
    const query = {
      text: 'SELECT id, title, description, due_date, priority, is_completed FROM todos WHERE is_deleted = false',
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = TodosService;