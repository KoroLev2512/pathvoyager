module.exports = {
  apps: [
    {
      name: 'pathvoyager-api',
      script: './server/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        SOCKET_PATH: '/var/www/clo/data/nodejs/1.sock',
        UPLOADS_DIR: '/var/www/clo/data/www/pathvoyager.com/public/uploads',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};

