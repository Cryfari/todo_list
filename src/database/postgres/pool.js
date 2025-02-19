const {Pool} = require('pg');

const testConfig = require('./testConfig');

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();

module.exports = pool;