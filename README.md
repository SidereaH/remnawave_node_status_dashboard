# Remnawave Node Status Dashboard

🚀 **Профессиональная панель мониторинга статуса серверов Remnawave с простым развертыванием**

---

## 📖 О проекте

Remnawave Node Status Dashboard - это современное, полностью адаптивное веб-приложение для мониторинга статуса серверов Remnawave. Идеальное решение для партнеров и владельцев сервисов, которые ценят прозрачность и профессиональный подход.

### ✨ Ключевые возможности

- **📊 Мониторинг в реальном времени** - Мгновенное отображение статуса всех нод
- **🎨 Премиум дизайн** - Голубо-синяя тема с градиентами и современными анимациями
- **📱 Полная адаптивность** - Безупречное отображение на всех устройствах
- **⚡ Высокая производительность** - Оптимизированная загрузка и работа
- **🔧 Простота настройки** - Минимальная конфигурация для быстрого старта
- **🔒 Безопасность** - Отображение только публичной информации

---

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ или Docker
- API токен от панели управления Remnawave
- Доступ к серверу для развертывания

### Вариант 1: Локальная установка (для разработки)

```bash
# Клонируйте репозиторий
git clone https://github.com/SidereaH/remnawave_node_status_dashboard
cd remnawave_node_status_dashboard

# Установите зависимости
npm install

# Настройте окружение
cp .env.example .env.local
# Отредактируйте .env.local с вашими настройками
```

### Вариант 2: Docker установка (рекомендуется для продакшена)

```bash
# Создайте директорию для проекта
mkdir -p /opt/remnawave
cd /opt/remnawave

# Клонируйте репозиторий
git clone https://github.com/SidereaH/remnawave_node_status_dashboard
cd remnawave_node_status_dashboard
```

---

## ⚙️ Конфигурация

### Настройка переменных окружения

Создайте файлы конфигурации:

**.env.local** (для разработки):

```env
API_BASE_URL=https://your.adminpanel.com
API_TOKEN=your_development_api_token_here
METADATA_TITLE="Status Dashboard Title"
METADATA_DESCRIPTION="Status Dashboard Description"
```

**.env.production** (для продакшена):

```env
API_BASE_URL=https://your.production-panel.com
API_TOKEN=your_production_api_token_here
NODE_ENV=production
METADATA_TITLE="Status Dashboard Title"
METADATA_DESCRIPTION="Status Dashboard Description"

```

### Копирование файлов на сервер

```bash
# Копируем файл окружения
scp ~/path/to/env/.env.production root@your_server_ip:/opt/remnawave/remnawave_node_status_dashboard/

# Копируем логотип (опционально)
scp ~/path/to/logo/Logo.png root@your_server_ip:/opt/remnawave/remnawave_node_status_dashboard/public/
```

---

## 🐳 Запуск с Docker

### Быстрый запуск

```bash
cd /opt/remnawave/remnawave_node_status_dashboard
docker compose up -d
docker compose logs -f
```

### Проверка статуса

```bash
docker compose ps
docker compose logs remnawave-status-dashboard
```

---

## 🌐 Настройка домена и SSL

### 1. Получение SSL сертификата

```bash
# Установите acme.sh если еще не установлен
curl https://get.acme.sh | sh

# Получите сертификат
acme.sh --set-default-ca --server letsencrypt
acme.sh --issue --standalone -d 'status.yourdomain.com' \
  --key-file /opt/remnawave/nginx/status_privkey.key \
  --fullchain-file /opt/remnawave/nginx/status_fullchain.pem
```

### 2. Настройка DNS

Добавьте A-запись для вашего домена:

```
status.yourdomain.com A ваш_ip_сервера
```

### 3. Конфигурация Nginx

Создайте или отредактируйте конфигурацию в `/opt/remnawave/nginx/nginx.conf`:

```nginx
upstream remnawave-status-dashboard {
    server remnawave-status-dashboard:3001;
}

server {
    server_name status.yourdomain.com;

    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;

    location / {
        proxy_http_version 1.1;
        proxy_pass http://remnawave-status-dashboard;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # SSL Configuration (Mozilla Intermediate Guidelines)
    ssl_protocols          TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305;

    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;
    ssl_certificate "/etc/nginx/ssl/status_fullchain.pem";
    ssl_certificate_key "/etc/nginx/ssl/status_privkey.key";
    ssl_trusted_certificate "/etc/nginx/ssl/status_fullchain.pem";

    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 1.1.1.1 1.0.0.1 8.8.8.8 8.8.4.4 208.67.222.222 208.67.220.220 valid=60s;
    resolver_timeout 2s;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_min_length 256;
    gzip_types
        application/atom+xml
        application/geo+json
        application/javascript
        application/x-javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rdf+xml
        application/rss+xml
        application/xhtml+xml
        application/xml
        font/eot
        font/otf
        font/ttf
        image/svg+xml
        text/css
        text/javascript
        text/plain
        text/xml;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name status.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 4. Обновление docker-compose.yml

Добавьте в секцию volumes nginx сервиса:

```yaml
services:
  nginx:
    volumes:
      - ./status_privkey.key:/etc/nginx/ssl/status_privkey.key:ro
      - ./status_fullchain.pem:/etc/nginx/ssl/status_fullchain.pem:ro
```

### 5. Перезапуск сервисов

```bash
cd /opt/remnawave/nginx
docker compose down
docker compose up -d
docker compose logs -f
```

---

## 📊 Отображаемая информация

Для каждой ноды выводится:

- ✅ **Статус онлайн/офлайн** - Цветовая индикация в реальном времени
- 🌍 **Геолокация** - Страна и флаг расположения сервера
- 👥 **Онлайн пользователи** - Текущая нагрузка и активные подключения
- 💻 **Ресурсы сервера** - Загрузка CPU и использование RAM
- 📊 **Использование трафика** - Визуальный прогресс-бар с процентами
- ⚡ **Мультипликатор потребления** - Специальные условия трафика

> **Примечание по безопасности:** Отображается только публичная информация, конфиденциальные данные скрыты

---

## 🎨 Кастомизация

### Смена цветовой темы

Отредактируйте файл `theme.ts`:

```typescript
const primary: MantineColorsTuple = [
	'#e0f7ff', // светлый
	'#b3ebff', // светлый-средний
	'#80deff', // средний
	'#4dd0ff', // основной
	'#1ac6ff', // акцент
	'#00b3ff', // темный-акцент
	'#0091cc', // темный
	'#006c99', // очень темный
	'#004966', // deepest
	'#002633', // darkest
]
```

### Замена логотипа

Поместите ваш логотип в:

```
public/Logo.png
```

Рекомендуемые размеры: 200x60px (PNG с прозрачным фоном)

---

## 🔧 Технический стек

- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - Строгая типизация для надежности
- **Mantine UI** - Современные UI компоненты
- **Tabler Icons** - Красивые иконки
- **CSS Modules** - Модульная стилизация
- **Docker** - Контейнеризация для простого развертывания

---

## 🛠 Устранение неполадок

### Проверка соединения с API

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://your.adminpanel.com/api/nodes
```

### Проверка логов приложения

```bash
docker compose logs remnawave-status-dashboard
```

### Проверка конфигурации Nginx

```bash
docker compose exec nginx nginx -t
```

---

## 🔄 Обновление

```bash
cd /opt/remnawave/remnawave_node_status_dashboard
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

## 🤝 Поддержка и обратная связь

Нашли проблему или есть предложение по улучшению?

- 📧 **Создайте issue** в [GitHub репозитории](https://github.com/SidereaH/remnawave_node_status_dashboard)
- 💬 **Напишите напрямую** - техническая поддержка и консультации
- 🐙 **Pull requests** приветствуются!

---

## 📄 Лицензия

**MIT License** - свободное использование, модификация и распространение.

---

---

_Remnawave Node Status Dashboard - делаем мониторинг простым, красивым и профессиональным_
