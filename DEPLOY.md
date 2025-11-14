# Инструкция по деплою на ISPmanager

## Подготовка к деплою

### 1. Требования

- ISPmanager с поддержкой Node.js
- MySQL база данных (уже настроена в ISPmanager)
- Доступ к SSH или файловому менеджеру ISPmanager

### 2. Данные базы данных

Из ISPmanager вам понадобятся:
- **База данных:** `pathvoyager`
- **Сервер:** `MySQL-8.0.43` (или ваш сервер MySQL)
- **Хост:** `localhost` (или IP адрес сервера БД)
- **Порт:** `3306`
- **Пользователь:** `admin`
- **Пароль:** `aboba-2512`

## Шаги деплоя

### Шаг 1: Загрузка файлов проекта

1. Загрузите все файлы проекта на сервер через:
   - **FTP/SFTP** (FileZilla, WinSCP)
   - **SSH** (scp, rsync)
   - **Файловый менеджер ISPmanager**

2. Рекомендуемая структура на сервере:
   ```
   /var/www/username/data/www/yourdomain.com/
   ├── app/
   ├── server/
   ├── public/
   ├── package.json
   ├── .env
   └── ...
   ```

### Шаг 2: Настройка переменных окружения

Создайте файл `.env` в корне проекта со следующим содержимым:

```env
# MySQL настройки
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=aboba-2512
DB_NAME=pathvoyager

# Или используйте альтернативные переменные
# MYSQL_HOST=localhost
# MYSQL_PORT=3306
# MYSQL_USER=admin
# MYSQL_PASSWORD=aboba-2512
# MYSQL_DATABASE=pathvoyager

# CORS настройки (замените на ваш домен)
CORS_ORIGIN=https://pathvoyager.com,https://www.pathvoyager.com

# URL бэкенд-сервера (замените на ваш домен)
API_BASE_URL=https://api.pathvoyager.com
NEXT_PUBLIC_API_BASE_URL=https://api.pathvoyager.com

# Порт бэкенд-сервера
PORT=4000

# Node окружение
NODE_ENV=production
```

### Шаг 3: Установка зависимостей

Через SSH подключитесь к серверу и выполните:

```bash
cd /var/www/username/data/www/yourdomain.com
npm install --production
```

### Шаг 4: Сборка Next.js приложения

```bash
npm run build
```

### Шаг 5: Настройка Node.js приложения в ISPmanager

1. Войдите в панель ISPmanager
2. Перейдите в раздел **"WWW"** → **"Node.js приложения"**
3. Нажмите **"Создать"**

4. Заполните форму:
   - **Домен:** ваш домен (например, `pathvoyager.com`)
   - **Путь к приложению:** `/var/www/username/data/www/yourdomain.com`
   - **Команда запуска:** `npm start`
   - **Порт:** `3000` (или другой свободный порт)
   - **Переменные окружения:** добавьте переменные из `.env` файла

5. Сохраните настройки

### Шаг 6: Настройка бэкенд-сервера (Express)

#### Вариант 1: Через PM2 (рекомендуется)

1. Установите PM2 глобально:
   ```bash
   npm install -g pm2
   ```

2. Создайте файл `ecosystem.config.js` в корне проекта:
   ```javascript
   module.exports = {
     apps: [{
       name: 'pathvoyager-api',
       script: './server/index.js',
       instances: 1,
       exec_mode: 'fork',
       env: {
         NODE_ENV: 'production',
         PORT: 4000
       }
     }]
   };
   ```

3. Запустите через PM2:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

#### Вариант 2: Через ISPmanager (Node.js приложение)

1. Создайте второе Node.js приложение для API:
   - **Домен:** `api.pathvoyager.com` (или поддомен)
   - **Путь:** тот же путь к проекту
   - **Команда запуска:** `node server/index.js`
   - **Порт:** `4000`

### Шаг 7: Настройка Nginx (если требуется)

Если ISPmanager не настроил автоматически, добавьте конфигурацию Nginx:

```nginx
# Frontend (Next.js)
server {
    listen 80;
    server_name pathvoyager.com www.pathvoyager.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API (Express)
server {
    listen 80;
    server_name api.pathvoyager.com;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Шаг 8: Настройка SSL сертификата

1. В ISPmanager перейдите в **"WWW"** → **"SSL сертификаты"**
2. Выберите ваш домен
3. Включите **"Let's Encrypt"** для автоматического получения сертификата
4. Примените изменения

### Шаг 9: Проверка работы

1. Откройте ваш сайт: `https://pathvoyager.com`
2. Проверьте API: `https://api.pathvoyager.com/health`
3. Проверьте админ-панель: `https://pathvoyager.com/admin`

## Обновление проекта

Для обновления проекта после изменений:

```bash
cd /var/www/username/data/www/yourdomain.com
git pull  # если используете git
npm install
npm run build
pm2 restart pathvoyager-api  # если используете PM2
# или перезапустите через ISPmanager
```

## Устранение проблем

### Проблема: База данных не подключается

**Решение:**
1. Проверьте, что база данных создана в ISPmanager
2. Убедитесь, что пользователь имеет права доступа к базе
3. Проверьте правильность данных в `.env` файле
4. Проверьте, что MySQL сервер запущен

### Проблема: Порт уже занят

**Решение:**
1. Измените порт в `.env` файле
2. Обновите настройки в ISPmanager
3. Перезапустите приложение

### Проблема: CORS ошибки

**Решение:**
1. Убедитесь, что `CORS_ORIGIN` в `.env` содержит правильные домены
2. Проверьте, что фронтенд и бэкенд используют правильные URL

### Проблема: Статические файлы не загружаются

**Решение:**
1. Проверьте права доступа к папке `public/`
2. Убедитесь, что Next.js правильно настроен для production

## Дополнительные настройки

### Оптимизация производительности

1. Включите кэширование в Nginx
2. Настройте CDN для статических файлов
3. Используйте Redis для кэширования (опционально)

### Мониторинг

1. Настройте логирование через PM2:
   ```bash
   pm2 logs pathvoyager-api
   ```

2. Настройте мониторинг через ISPmanager

### Резервное копирование

1. Настройте автоматическое резервное копирование базы данных в ISPmanager
2. Регулярно делайте бэкапы файлов проекта

## Контакты и поддержка

При возникновении проблем проверьте:
- Логи приложения: `pm2 logs` или через ISPmanager
- Логи Nginx: `/var/log/nginx/error.log`
- Логи MySQL: через ISPmanager

