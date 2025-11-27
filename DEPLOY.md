# Инструкция по деплою на ISPmanager

## Конфигурация сервера

### Основные параметры

- **Доменное имя:** `pathvoyager.com`
- **Директория проекта:** `/var/www/clo/data/www/pathvoyager.com`
- **Node.js версия:** `25.2.0`
- **Путь к Node.js:** `/var/www/clo/data/.nvm/versions/node/v25.2.0/bin/node`
- **Путь к Npm:** `/var/www/clo/data/.nvm/versions/node/v25.2.0/bin/npm`
- **Unix Socket:** `/var/www/clo/data/nodejs/1.sock`
- **Email администратора:** `webmaster@pathvoyager.com`

### База данных MySQL

- **База данных:** `pathvoyager`
- **Пользователь:** `admin`
- **Пароль:** `aboba-2512`
- **Хост:** `localhost`
- **Порт:** `3306`

### Оптимизация и защита

- **Сжатие:** уровень 5
- **Кэширование:** 24 часа
- **Защита от DDoS:** включено
- **Лимит запросов:** 25 запросов/сек с одного IP
- **Всплеск:** до 100 запросов/сек

## Подготовка к деплою

### 1. Требования

- ISPmanager с поддержкой Node.js 25.2.0
- MySQL база данных (уже настроена в ISPmanager)
- Доступ к SSH или файловому менеджеру ISPmanager

## Шаги деплоя

### Шаг 1: Загрузка файлов проекта

1. Загрузите все файлы проекта на сервер через:
   - **FTP/SFTP** (FileZilla, WinSCP)
   - **SSH** (scp, rsync)
   - **Файловый менеджер ISPmanager**

2. Структура на сервере:
   ```
   /var/www/clo/data/www/pathvoyager.com/
   ├── src/
   ├── server/
   ├── public/
   ├── package.json
   ├── ecosystem.config.js
   ├── .env
   └── ...
   ```

### Шаг 2: Настройка переменных окружения

Создайте файл `.env` в корне проекта (`/var/www/clo/data/www/pathvoyager.com/.env`) со следующим содержимым:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=aboba-2512
DB_NAME=pathvoyager

# Alternative MySQL environment variables (for compatibility)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=admin
MYSQL_PASSWORD=aboba-2512
MYSQL_DATABASE=pathvoyager

# Server Configuration
PORT=4000
SOCKET_PATH=/var/www/clo/data/nodejs/1.sock

# CORS Configuration
CORS_ORIGIN=https://pathvoyager.com,https://www.pathvoyager.com

# API Configuration
API_BASE_URL=https://pathvoyager.com
NEXT_PUBLIC_API_BASE_URL=https://pathvoyager.com

# Node Environment
NODE_ENV=production

# Email Configuration
ADMIN_EMAIL=webmaster@pathvoyager.com

# Uploads Directory (для продакшена используйте абсолютный путь)
# В ecosystem.config.js уже настроено, но можно также добавить в .env:
# UPLOADS_DIR=/var/www/clo/data/www/pathvoyager.com/public/uploads
```

**Важно:** Убедитесь, что файл `.env` имеет правильные права доступа (обычно `644` или `600`).

### Шаг 3: Установка зависимостей

Через SSH подключитесь к серверу и выполните:

```bash
cd /var/www/clo/data/www/pathvoyager.com

# Используйте правильный путь к npm
/var/www/clo/data/.nvm/versions/node/v25.2.0/bin/npm install --production
```

Или добавьте Node.js в PATH:
```bash
export PATH="/var/www/clo/data/.nvm/versions/node/v25.2.0/bin:$PATH"
cd /var/www/clo/data/www/pathvoyager.com
npm install --production
```

### Шаг 4: Сборка Next.js приложения

```bash
cd /var/www/clo/data/www/pathvoyager.com
/var/www/clo/data/.nvm/versions/node/v25.2.0/bin/npm run build
```

Или с добавленным в PATH:
```bash
npm run build
```

### Шаг 5: Настройка Node.js приложения в ISPmanager

1. Войдите в панель ISPmanager
2. Перейдите в раздел **"WWW"** → **"Node.js приложения"**
3. Нажмите **"Создать"** или отредактируйте существующее приложение

4. Заполните форму:
   - **Домен:** `pathvoyager.com`
   - **Путь к приложению:** `/var/www/clo/data/www/pathvoyager.com`
   - **Путь к Node.js:** `/var/www/clo/data/.nvm/versions/node/v25.2.0/bin/node`
   - **Путь к Npm:** `/var/www/clo/data/.nvm/versions/node/v25.2.0/bin/npm`
   - **Команда запуска:** `npm start` (для Next.js фронтенда)
   - **Сокет:** `/var/www/clo/data/nodejs/1.sock` (для бэкенд API)
   - **Переменные окружения:** добавьте переменные из `.env` файла или используйте файл `.env` напрямую

5. Сохраните настройки

### Шаг 6: Настройка бэкенд-сервера (Express)

#### Вариант 1: Через PM2 (рекомендуется)

1. Установите PM2 глобально (если еще не установлен):
   ```bash
   /var/www/clo/data/.nvm/versions/node/v25.2.0/bin/npm install -g pm2
   ```

2. Файл `ecosystem.config.js` уже создан в корне проекта с правильными настройками:
   - Использует Unix socket: `/var/www/clo/data/nodejs/1.sock`
   - Настроен для production окружения
   - Указан абсолютный путь для uploads: `UPLOADS_DIR=/var/www/clo/data/www/pathvoyager.com/public/uploads`

3. Запустите через PM2:
   ```bash
   cd /var/www/clo/data/www/pathvoyager.com
   export PATH="/var/www/clo/data/.nvm/versions/node/v25.2.0/bin:$PATH"
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. Проверьте статус:
   ```bash
   pm2 status
   pm2 logs pathvoyager-api
   ```

#### Вариант 2: Через ISPmanager (Node.js приложение)

1. Создайте второе Node.js приложение для API:
   - **Домен:** `pathvoyager.com` (тот же домен, но другой обработчик)
   - **Путь:** `/var/www/clo/data/www/pathvoyager.com`
   - **Путь к Node.js:** `/var/www/clo/data/.nvm/versions/node/v25.2.0/bin/node`
   - **Команда запуска:** `node server/index.js`
   - **Сокет:** `/var/www/clo/data/nodejs/1.sock`
   - **Переменные окружения:** используйте файл `.env` или добавьте вручную

### Шаг 7: Настройка Nginx (если требуется)

ISPmanager обычно настраивает Nginx автоматически, но если требуется ручная настройка:

```nginx
# Frontend (Next.js)
server {
    listen 80;
    server_name pathvoyager.com www.pathvoyager.com;
    
    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pathvoyager.com www.pathvoyager.com;
    
    # SSL сертификат (настраивается через ISPmanager)
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Кэширование (24 часа)
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=pathvoyager_cache:10m max_size=1g inactive=24h;
    
    location / {
        proxy_pass http://unix:/var/www/clo/data/nodejs/1.sock;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Кэширование
        proxy_cache pathvoyager_cache;
        proxy_cache_valid 200 24h;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    }
    
    # Статические файлы из uploads (загруженные изображения)
    # ВАЖНО: Настройте этот блок ПЕРЕД location /, чтобы Nginx раздавал файлы напрямую
    # Это критически важно для работы загруженных изображений!
    location /uploads/ {
        # Абсолютный путь к папке с загруженными файлами
        alias /var/www/clo/data/www/pathvoyager.com/public/uploads/;
        
        # Кэширование на 1 год
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        
        # Разрешаем только изображения
        location ~* \.(png|jpg|jpeg|gif|webp|svg|ico)$ {
            try_files $uri =404;
            access_log off;
        }
        
        # Блокируем доступ к другим типам файлов
        deny all;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://unix:/var/www/clo/data/nodejs/1.sock;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Защита от DDoS (25 req/sec, всплеск до 100)
        limit_req zone=ddos_limit burst=100 nodelay;
    }
    
    # Защита от DDoS
    limit_req_zone $binary_remote_addr zone=ddos_limit:10m rate=25r/s;
    
    # Сжатие (уровень 5)
    gzip on;
    gzip_comp_level 5;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Примечание:** ISPmanager обычно настраивает это автоматически, но вы можете проверить конфигурацию в панели управления.

### Шаг 8: Настройка SSL сертификата

1. В ISPmanager перейдите в **"WWW"** → **"SSL сертификаты"**
2. Выберите домен `pathvoyager.com`
3. Включите **"Let's Encrypt"** для автоматического получения сертификата
4. Примените изменения

### Шаг 9: Проверка работы

1. Откройте ваш сайт: `https://pathvoyager.com`
2. Проверьте API: `https://pathvoyager.com/api/health`
3. Проверьте админ-панель: `https://pathvoyager.com/admin`
4. Проверьте логи:
   ```bash
   pm2 logs pathvoyager-api
   # или через ISPmanager: Журналы сайта → Журнал ошибок / Журнал запросов
   ```

## Обновление проекта

Для обновления проекта после изменений:

```bash
cd /var/www/clo/data/www/pathvoyager.com
export PATH="/var/www/clo/data/.nvm/versions/node/v25.2.0/bin:$PATH"

# Если используете git
git pull

# Установка зависимостей
npm install --production

# Сборка Next.js приложения
npm run build

# Перезапуск бэкенд API (если используете PM2)
pm2 restart pathvoyager-api

# Или перезапустите через ISPmanager: WWW → Node.js приложения → Перезапустить
```

## Устранение проблем

### Проблема: База данных не подключается

**Решение:**
1. Проверьте, что база данных `pathvoyager` создана в ISPmanager
2. Убедитесь, что пользователь `admin` имеет права доступа к базе
3. Проверьте правильность данных в `.env` файле:
   ```bash
   cat /var/www/clo/data/www/pathvoyager.com/.env
   ```
4. Проверьте подключение к MySQL:
   ```bash
   mysql -h localhost -u admin -p pathvoyager
   # Введите пароль: aboba-2512
   ```
5. Проверьте логи приложения:
   ```bash
   pm2 logs pathvoyager-api --lines 50
   ```

### Проблема: Unix socket не создается

**Решение:**
1. Проверьте права доступа к директории `/var/www/clo/data/nodejs/`:
   ```bash
   ls -la /var/www/clo/data/nodejs/
   ```
2. Убедитесь, что директория существует и доступна для записи:
   ```bash
   sudo mkdir -p /var/www/clo/data/nodejs
   sudo chown -R www-data:www-data /var/www/clo/data/nodejs
   sudo chmod 755 /var/www/clo/data/nodejs
   ```
3. Проверьте, что в `.env` указан правильный путь: `SOCKET_PATH=/var/www/clo/data/nodejs/1.sock`

### Проблема: CORS ошибки

**Решение:**
1. Убедитесь, что `CORS_ORIGIN` в `.env` содержит правильные домены:
   ```
   CORS_ORIGIN=https://pathvoyager.com,https://www.pathvoyager.com
   ```
2. Проверьте, что фронтенд и бэкенд используют правильные URL
3. Перезапустите приложение после изменения `.env`:
   ```bash
   pm2 restart pathvoyager-api
   ```

### Проблема: Статические файлы не загружаются

**Решение:**
1. Проверьте права доступа к папке `public/`:
   ```bash
   ls -la /var/www/clo/data/www/pathvoyager.com/public/
   ```
2. Убедитесь, что Next.js правильно собран:
   ```bash
   npm run build
   ```
3. Проверьте, что файлы в `.next/` существуют

### Проблема: Загруженные изображения возвращают 404 (GET /uploads/... 404)

**Диагностика:**
1. **Проверьте, существует ли файл на сервере:**
   ```bash
   ls -la /var/www/clo/data/www/pathvoyager.com/public/uploads/
   # Или проверьте конкретный файл:
   ls -la /var/www/clo/data/www/pathvoyager.com/public/uploads/1764289451412-227170247-supabase-schema-qmeatgjmrihutzzkflxb.png
   ```

2. **Проверьте, где сервер сохраняет файлы:**
   ```bash
   # Проверьте логи PM2, чтобы увидеть путь к uploads директории:
   pm2 logs pathvoyager-api --lines 100 | grep -i upload
   # Или проверьте последние логи после загрузки файла:
   pm2 logs pathvoyager-api --lines 50
   ```

3. **Найдите все файлы uploads на сервере:**
   ```bash
   # Поиск всех PNG файлов в проекте:
   find /var/www/clo/data/www/pathvoyager.com -name "*.png" -type f | head -20
   
   # Поиск конкретного файла:
   find /var/www/clo/data/www/pathvoyager.com -name "1764289451412-227170247-supabase-schema-qmeatgjmrihutzzkflxb.png"
   
   # Проверьте, может быть файлы в .next/standalone/public/uploads/:
   ls -la /var/www/clo/data/www/pathvoyager.com/.next/standalone/public/uploads/ 2>/dev/null || echo "Directory does not exist"
   ```

3. **Проверьте конфигурацию Nginx:**
   ```bash
   # Убедитесь, что блок location /uploads/ настроен ПЕРЕД location /
   nginx -T | grep -A 10 "location /uploads"
   ```

4. **Проверьте права доступа:**
   ```bash
   # Директория должна быть доступна для чтения:
   chmod 755 /var/www/clo/data/www/pathvoyager.com/public/uploads
   chmod 644 /var/www/clo/data/www/pathvoyager.com/public/uploads/*.png
   ```

**Решение:**

1. **Убедитесь, что Nginx настроен правильно:**
   - Блок `location /uploads/` должен быть **ПЕРЕД** `location /`
   - Проверьте, что путь в `alias` правильный: `/var/www/clo/data/www/pathvoyager.com/public/uploads/`
   - Перезагрузите Nginx: `nginx -t && systemctl reload nginx`

2. **Убедитесь, что файлы сохраняются в правильную директорию:**
   - В `ecosystem.config.js` уже настроено `UPLOADS_DIR=/var/www/clo/data/www/pathvoyager.com/public/uploads`
   - Перезапустите PM2, чтобы применить изменения: `pm2 restart pathvoyager-api`
   - Проверьте логи после перезапуска: `pm2 logs pathvoyager-api --lines 20 | grep -i upload`
   - Должно быть сообщение: `Uploads directory: /var/www/clo/data/www/pathvoyager.com/public/uploads`

3. **Проверьте, что директория существует:**
   ```bash
   mkdir -p /var/www/clo/data/www/pathvoyager.com/public/uploads
   chown -R www-data:www-data /var/www/clo/data/www/pathvoyager.com/public/uploads
   chmod 755 /var/www/clo/data/www/pathvoyager.com/public/uploads
   ```

4. **Если файлы сохраняются в другую директорию:**
   - Проверьте логи PM2, чтобы увидеть фактический путь к uploads: `pm2 logs pathvoyager-api | grep "File uploaded"`
   - Если файлы в `.next/standalone/public/uploads/`, переместите их:
     ```bash
     mkdir -p /var/www/clo/data/www/pathvoyager.com/public/uploads
     cp -r /var/www/clo/data/www/pathvoyager.com/.next/standalone/public/uploads/* /var/www/clo/data/www/pathvoyager.com/public/uploads/ 2>/dev/null || true
     ```
   - Если файлы в другой директории, найдите их и переместите:
     ```bash
     # Найдите директорию с файлами
     find /var/www/clo/data/www/pathvoyager.com -name "1764289451412-*.png" -type f
     # Скопируйте все файлы в правильную директорию
     mkdir -p /var/www/clo/data/www/pathvoyager.com/public/uploads
     # Замените <найденный_путь> на фактический путь
     cp <найденный_путь>/*.png /var/www/clo/data/www/pathvoyager.com/public/uploads/
     ```
   - После перемещения файлов перезапустите PM2: `pm2 restart pathvoyager-api`

5. **Временное решение - использовать API route:**
   - API route `/api/uploads/[...path]` уже создан и будет работать как fallback
   - Но это менее эффективно, чем прямая раздача через Nginx

### Проблема: Порт 4000 уже занят (EADDRINUSE)

**Решение:**
Это означает, что сервер уже запущен. Не запускайте сервер вручную через `npm run server` на продакшене!

1. **Проверьте статус PM2:**
   ```bash
   pm2 status
   pm2 logs pathvoyager-api --lines 50
   ```

2. **Если сервер запущен через PM2, используйте команды PM2:**
   ```bash
   # Перезапустить сервер
   pm2 restart pathvoyager-api
   
   # Остановить сервер
   pm2 stop pathvoyager-api
   
   # Удалить из PM2
   pm2 delete pathvoyager-api
   ```

3. **Если нужно запустить сервер заново через PM2:**
   ```bash
   cd /var/www/clo/data/www/pathvoyager.com
   export PATH="/var/www/clo/data/.nvm/versions/node/v25.2.0/bin:$PATH"
   pm2 start ecosystem.config.js
   pm2 save
   ```

4. **Если нужно запустить вручную для отладки (не рекомендуется на продакшене):**
   - Сначала остановите PM2 процесс:
     ```bash
     pm2 stop pathvoyager-api
     ```
   - Или используйте другой порт:
     ```bash
     PORT=4001 npm run server
     ```

5. **Проверьте, какой процесс занимает порт 4000:**
   ```bash
   lsof -i :4000
   # Или
   netstat -tulpn | grep 4000
   ```

### Проблема: Node.js версия не соответствует

**Решение:**
1. Убедитесь, что используется правильная версия Node.js:
   ```bash
   /var/www/clo/data/.nvm/versions/node/v25.2.0/bin/node --version
   ```
2. В ISPmanager проверьте путь к Node.js: `/var/www/clo/data/.nvm/versions/node/v25.2.0/bin/node`
3. В PM2 используйте правильный путь:
   ```bash
   pm2 delete pathvoyager-api
   /var/www/clo/data/.nvm/versions/node/v25.2.0/bin/pm2 start ecosystem.config.js
   ```

## Дополнительные настройки

### Оптимизация производительности

1. **Кэширование:** Уже настроено на 24 часа через ISPmanager
2. **Сжатие:** Уровень 5 настроен в ISPmanager
3. **CDN:** Рассмотрите возможность использования CDN для статических файлов
4. **Redis:** Опционально для кэширования данных (если требуется)

### Мониторинг и логирование

1. **Логирование через PM2:**
   ```bash
   pm2 logs pathvoyager-api
   pm2 logs pathvoyager-api --lines 100
   pm2 monit
   ```

2. **Логирование через ISPmanager:**
   - Журнал ошибок: доступен в панели ISPmanager
   - Журнал запросов: доступен в панели ISPmanager
   - Период ротации: ежедневно
   - Хранить архивов: 10

3. **Мониторинг производительности:**
   ```bash
   pm2 status
   pm2 info pathvoyager-api
   ```

### Резервное копирование

1. **База данных:**
   - Настройте автоматическое резервное копирование в ISPmanager
   - Рекомендуется делать бэкапы ежедневно

2. **Файлы проекта:**
   - Регулярно делайте бэкапы директории `/var/www/clo/data/www/pathvoyager.com`
   - Особенно важны: `.env`, `ecosystem.config.js`, `package.json`

3. **Ручной бэкап БД:**
   ```bash
   mysqldump -h localhost -u admin -p pathvoyager > backup_$(date +%Y%m%d).sql
   ```

### Безопасность

1. **Защита от DDoS:** Уже настроена в ISPmanager (25 req/sec, всплеск до 100)
2. **SSL сертификат:** Настроен через Let's Encrypt
3. **Права доступа:** Убедитесь, что `.env` файл имеет права `600`:
   ```bash
   chmod 600 /var/www/clo/data/www/pathvoyager.com/.env
   ```
4. **Обновления:** Регулярно обновляйте зависимости:
   ```bash
   npm audit
   npm update
   ```

## Контакты и поддержка

При возникновении проблем проверьте:

- **Логи приложения:** 
  - PM2: `pm2 logs pathvoyager-api`
  - ISPmanager: Журналы сайта → Журнал ошибок / Журнал запросов
  
- **Логи Nginx:** `/var/log/nginx/error.log` (если есть доступ)

- **Логи MySQL:** через ISPmanager

- **Email администратора:** `webmaster@pathvoyager.com`

- **Проверка статуса:**
  ```bash
  # Статус PM2
  pm2 status
  
  # Проверка API
  curl https://pathvoyager.com/api/health
  
  # Проверка подключения к БД
  mysql -h localhost -u admin -p pathvoyager
  ```

