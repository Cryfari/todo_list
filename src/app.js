require('dotenv').config();
const createServer = require('./http/createServer');

const pool = require('./database/postgres/pool');

const {nanoid} = require('nanoid');
(async () => {
  const server = await createServer(pool, nanoid);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
