const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

// Configure the PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "postgres-db",
  database: "postgres",
  password: "postgres123",
  port: 5432, // Default PostgreSQL port
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
