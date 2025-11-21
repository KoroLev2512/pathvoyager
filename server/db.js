const mysql = require("mysql2/promise");

const getDbConfig = () => {
  // Поддержка DATABASE_URL для совместимости
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

  return {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || "localhost",
    port: process.env.DB_PORT || process.env.MYSQL_PORT ? Number(process.env.DB_PORT || process.env.MYSQL_PORT) : 3306,
    user: process.env.DB_USER || process.env.MYSQL_USER || "admin",
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || "aboba-2512",
    database: process.env.DB_NAME || process.env.MYSQL_DATABASE || "pathvoyager",
  };
};

let pool;

async function initialise() {
  try {
    const dbConfig = getDbConfig();

    // Создаем пул подключений
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    // Проверяем подключение
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    // Создаем таблицы
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
    
    // Добавляем колонку popular, если её нет (для существующих таблиц)
    try {
      await pool.query(`
        ALTER TABLE articles 
        ADD COLUMN IF NOT EXISTS popular BOOLEAN DEFAULT FALSE,
        ADD INDEX IF NOT EXISTS idx_popular (popular);
      `);
    } catch (error) {
      // Игнорируем ошибку, если колонка уже существует или синтаксис не поддерживается
      // Для MySQL 5.7+ используем отдельный запрос
      try {
        await pool.query(`ALTER TABLE articles ADD COLUMN popular BOOLEAN DEFAULT FALSE;`);
      } catch (e) {
        // Колонка уже существует, игнорируем
      }
      try {
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_popular ON articles(popular);`);
      } catch (e) {
        // Индекс уже существует, игнорируем
      }
    }
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
