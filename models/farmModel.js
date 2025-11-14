// models/farmModel.js
const db = require("../config/db");

const FarmModel = {
  getAll: async () => await db.query("SELECT * FROM farm"),
  getById: async (id) =>
    await db.query("SELECT * FROM farm WHERE id = $1", [id]),
  // create
  create: async ({ name, location, size, image_url }) =>
    await db.query(
      "INSERT INTO farm (name, location, size, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, location, size, image_url]
    ),

  // update
  update: async (id, { name, location, size, image_url }) =>
    await db.query(
      "UPDATE farm SET name = $1, location = $2, size = $3, image_url = $4 WHERE id = $5 RETURNING *",
      [name, location, size, image_url, id]
    ),

  delete: async (id) => await db.query("DELETE FROM farm WHERE id = $1", [id]),
};

module.exports = FarmModel;
