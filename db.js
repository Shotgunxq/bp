const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

// Configure the PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  // host: "postgres-db", //toto pre DOCKER KED CHCES KOMUNIKOVAT BE NA DOCKER
  host: "localhost",  //inak pouzivaj toto na lokale
  database: "postgres",
  password: "postgres123",
  port: 5432, // Default PostgreSQL port
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
