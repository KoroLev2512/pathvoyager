import mysql, { type Pool } from "mysql2/promise";

type DbConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

const getDbConfig = (): DbConfig => {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
    };
  }

  const host = process.env.DB_HOST || process.env.MYSQL_HOST || "localhost";
  const portValue = process.env.DB_PORT || process.env.MYSQL_PORT;
  const port = portValue ? Number(portValue) : 3306;
  const user = process.env.DB_USER || process.env.MYSQL_USER || "admin";
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || "aboba-2512";
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || "pathvoyager";

  return { host, port, user, password, database };
};

let poolPromise: Promise<Pool> | null = null;

const initialisePool = async (): Promise<Pool> => {
  const dbConfig = getDbConfig();

  const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      hero_image TEXT,
      category_id VARCHAR(255) NOT NULL,
      author_name VARCHAR(255),
      read_time VARCHAR(50),
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      content JSON NOT NULL,
      popular BOOLEAN DEFAULT FALSE,
      INDEX idx_slug (slug),
      INDEX idx_published_at (published_at),
      INDEX idx_popular (popular)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  try {
    await pool.query(`
      ALTER TABLE articles 
      ADD COLUMN IF NOT EXISTS popular BOOLEAN DEFAULT FALSE,
      ADD INDEX IF NOT EXISTS idx_popular (popular);
    `);
  } catch {
    try {
      await pool.query(`ALTER TABLE articles ADD COLUMN popular BOOLEAN DEFAULT FALSE;`);
    } catch {
      // Column already exists
    }
    try {
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_popular ON articles(popular);`);
    } catch {
      // Index already exists
    }
  }

  console.log("Database tables initialized successfully.");
  return pool;
};

export const getDbPool = async (): Promise<Pool> => {
  if (!poolPromise) {
    poolPromise = initialisePool().catch((error) => {
      poolPromise = null;
      throw error;
    });
  }

  return poolPromise;
};

export const getDbPoolSafe = async (): Promise<Pool | null> => {
  try {
    return await getDbPool();
  } catch (error) {
    console.error("Database not available:", error);
    return null;
  }
};


