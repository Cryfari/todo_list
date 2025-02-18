require('dotenv').config();
const createServer = require('./http/createServer');

(async () => {
  const server = await createServer();
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
