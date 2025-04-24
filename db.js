const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Configure the PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  // host: "postgres-db", //toto pre DOCKER KED CHCES KOMUNIKOVAT BE NA DOCKER
  host: 'localhost', //inak pouzivaj toto na lokale
  database: 'postgres',
  password: 'postgres123',
  port: 5432, // Default PostgreSQL port
});

const findUserById = async userId => {
  const query = 'SELECT * FROM users WHERE user_id = $1';
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows[0]; // Return the user if found, otherwise undefined
};

const insertUser = async user => {
  const query = 'INSERT INTO users (user_id, user_type, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5)';
  const values = [user.userId, user.employeeType, user.givenName, user.lastName, user.email];
  await pool.query(query, values);
};

module.exports = {
  pool, // expose the PG pool for session store
  query: (text, params) => pool.query(text, params),
  findUserById,
  insertUser,
};
