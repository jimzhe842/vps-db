const { dbQuery } = require("./db-query");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

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

  async createWebhook(userId) {
    let createdAt = new Date();
    let v4 = uuid.v4();
    let payloads = JSON.stringify({Payloads: []});
    const CREATE_WEBHOOK = "INSERT INTO webhooks (uuid, user_id, created_at, payloads) VALUES ($1, $2, $3, $4)";
    let result = await dbQuery(CREATE_WEBHOOK, v4, userId, createdAt, payloads);
    return result.rowCount > 0;
  }

  async loadWebhook(webhookUuid) {
    const LOAD_WEBHOOK = "SELECT * FROM webhooks WHERE uuid = $1";
    let result = await dbQuery(LOAD_WEBHOOK, webhookUuid);
    return result;
  }

  async loadWebhooks(userId) {
    const LOAD_WEBHOOKS = "SELECT * FROM webhooks WHERE user_id = $1";
    let result = await dbQuery(LOAD_WEBHOOKS, userId);
    return result;
  }

  async updatePayloads(webhookUuid, payloadsJsonb) {
    const UPDATE_PAYLOADS = "UPDATE webhooks SET payloads = $1 WHERE uuid = $2";
    let result = await dbQuery(UPDATE_PAYLOADS, payloadsJsonb, webhookUuid);
    return result.rowCount > 0;
  }
}