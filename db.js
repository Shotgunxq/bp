const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Configure the PostgreSQL connection
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres-db',
  database: process.env.POSTGRES_DB || 'myappdb', // ← use myappdb
  password: process.env.POSTGRES_PASSWORD || 'postgres123',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
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
