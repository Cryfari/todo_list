const pino = require('pino');
require('dotenv').config();

const logger = pino({
  level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty', 
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          levelFirst: true,
        },
        level: 'info', 
      },
      {
        target: 'pino/file',
        options: {
          destination: './app.log',
          mkdir: true,
        },
        level: 'debug',
      },
    ],
  },
});

module.exports = logger;
