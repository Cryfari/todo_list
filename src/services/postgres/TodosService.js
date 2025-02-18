
const InvariantError = require('../../exceptions/InvariantError');

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
      throw new InvariantError('Todo failed to add');
    }

    return result.rows[0].id;
  }
}

module.exports = TodosService;