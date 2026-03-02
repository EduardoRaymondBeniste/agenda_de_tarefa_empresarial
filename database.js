const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = {
  query: (text, params, callback) => {
    // Isso traduz os "?" do seu server.js para "$1, $2" do Postgres
    let i = 1;
    const pgSql = text.replace(/\?/g, () => `$${i++}`);
    return pool.query(pgSql, params, (err, res) => {
      if (err) return callback(err);
      callback(null, res.rows);
    });
  }
};