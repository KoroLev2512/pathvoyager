const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const getDbConfig = () => {
  if (connectionString) {
    return {
      connectionString,
      ssl:
        process.env.PGSSLMODE === "require"
          ? { rejectUnauthorized: false }
          : process.env.PGSSLMODE
          ? false
          : undefined,
    };
  }
  return {
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGDATABASE || "pathvoyager",
  };
};

let pool;

async function ensureDatabaseExists() {
  const dbConfig = getDbConfig();
  const dbName = connectionString
    ? new URL(connectionString).pathname.slice(1)
    : dbConfig.database;

  if (!dbName) {
    throw new Error("Database name not specified");
  }

  // Подключаемся к системной базе данных postgres для создания базы данных
  const adminPool = new Pool({
    host: dbConfig.host || "localhost",
    port: dbConfig.port || 5432,
    user: dbConfig.user || "postgres",
    password: dbConfig.password || "postgres",
    database: "postgres",
  });

  try {
    // Проверяем, существует ли база данных
    const result = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName],
    );

    if (result.rows.length === 0) {
      console.log(`Creating database "${dbName}"...`);
      await adminPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    }
  } catch (error) {
    if (error.code === "3D000" || error.message.includes("does not exist")) {
      throw new Error(
        `Database "${dbName}" does not exist and could not be created. Please create it manually:\n` +
          `  psql -U postgres -c "CREATE DATABASE ${dbName};"`,
      );
    }
    throw error;
  } finally {
    await adminPool.end();
  }
}

async function initialise() {
  try {
    // Создаем базу данных, если её нет (только для локальной разработки без DATABASE_URL)
    if (!connectionString) {
      await ensureDatabaseExists();
    }

    // Создаем пул подключений к нужной базе данных
    pool = new Pool(getDbConfig());

    // Создаем таблицы
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
    console.log("Database tables initialized successfully.");
  } catch (error) {
    console.error("Failed to initialise database:", error.message);
    throw error;
  }
}

function getPool() {
  if (!pool) {
    throw new Error("Database pool is not initialised. Call initialise() first.");
  }
  return pool;
}

module.exports = {
  getPool,
  initialise,
};
