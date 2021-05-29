const config = require("./config");
const { Client } = require("pg");
const isProduction = (process.NODE_ENV == "production");
// const CONNECTION = {
  // connectionString: config.DATABASE_URL,
  // ssl: { rejectUnauthorized: isProduction }
  // ssl: { rejectUnauthorized: false }
// };

const CONNECTION = {
  database: "jelk",
  user: "postgres",
  password: "123"
}

// console.log(process.DB_PASSWORD);

const logQuery = (statement, parameters) => {
  let timeStamp = new Date();
  let formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

module.exports = {
  async dbQuery(statement, ...parameters) {
    let client = new Client(CONNECTION);

    await client.connect();
    logQuery(statement, parameters);
    let result = await client.query(statement, parameters);
    await client.end();

    return result;
  }
};