const config = require("./config");
const { Client } = require('pg');

const isProduction = (config.NODE_ENV === "production");

const CONNECTION = {
  connectionString: config.DATABASE_URL,
  ssl: isProduction,
  // ssl: { rejectUnauthorized: false },
};

module.exports = {
  async dbQuery(statement, ...parameters) {
    let client = new Client(CONNECTION);

    await client.connect();
    let result = await client.query(statement, parameters);
    await client.end();

    return result;
  }
};