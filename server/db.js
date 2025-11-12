const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl:
          process.env.PGSSLMODE === "require"
            ? { rejectUnauthorized: false }
            : process.env.PGSSLMODE
            ? false
            : undefined,
      }
    : {
        host: process.env.PGHOST || "localhost",
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "postgres",
        database: process.env.PGDATABASE || "pathvoyager",
      },
);

async function initialise() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      hero_image TEXT,
      category_id TEXT NOT NULL,
      author_name TEXT,
      read_time TEXT,
      published_at TIMESTAMPTZ DEFAULT NOW(),
      content JSONB NOT NULL
    );
  `);
}

module.exports = {
  pool,
  initialise,
};
