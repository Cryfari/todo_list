/* istanbul ignore file */
const pool = require('../database/postgres/pool');

const TodosTableHelper = {
  async addTodo({
    id = "todo-123",
    title = "Hello",
    description = "World",
    due_date = "2099-08-08",
    priority = "low",
  }) {
    const query = {
      text: 'INSERT INTO todos VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, title, description, due_date, priority],
    };

    await pool.query(query);
  },
  async findTodoById(id) {
    const query = {
      text: 'SELECT * FROM todos WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM todos');
  },
};

module.exports = TodosTableHelper;