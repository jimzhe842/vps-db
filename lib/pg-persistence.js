const { dbQuery } = require("./db-query");
const bcrypt = require("bcrypt");

module.exports = class PgPersistence {
  construct(session) {
    this.username = session.username;
  }
  
  async authenticate(username, password) {
    const FIND_HASHED_PASSWORD = "SELECT password FROM users WHERE username = $1";
    let result = await dbQuery(FIND_HASHED_PASSWORD, username);
    if (result.rowCount == 0) return false;

    return bcrypt.compare(password, result.rows[0].password);
  }

  async loadItems(portfolioId) {
    const FIND_ITEMS = "SELECT * FROM items WHERE portfolio_id = $1";
    let result = await dbQuery(FIND_ITEMS, portfolioId);
    return result.rows;
  }

  async deleteItem(portfolioId, itemId) {
    const DELETE_ITEM = "DELETE FROM items WHERE portfolio_id = $1 AND id = $2"
    let result = await dbQuery(DELETE_ITEM, portfolioId, itemId);
    return result.rowCount > 0;
  }

  async createItem(portfolioId, itemTitle) {
    const CREATE_ITEM = "INSERT INTO items (title, portfolio_id) VALUES ($1, $2)";
    let result = await dbQuery(CREATE_ITEM, itemTitle, portfolioId);
    return result.rowCount > 0;
  }
}