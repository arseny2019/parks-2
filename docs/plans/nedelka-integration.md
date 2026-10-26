# План интеграции лендинга «НЕДЕЛЬКА» в parki-2

> Статус: отложено до завершения периода наблюдения после Docker Compose
> миграции. Актуальное состояние инфраструктуры описано в
> [статусе миграции](../operations/migration-status.md).

## 1. Цель

Интегрировать лендинг «НЕДЕЛЬКА» в существующий проект `parki-2` так, чтобы:

- основной сайт продолжал работать на `парки.рф`;
- лендинг открывался на отдельном поддомене `<поддомен>.парки.рф`;
- основной сайт и лендинг обслуживались одним приложением Next.js;
- контент лендинга управлялся через существующий Directus;
- frontend, Directus и PostgreSQL запускались одним Docker Compose-проектом;
- обновление выполнялось одним `git pull` и одной deploy-командой;
- существующая база данных и загруженные в Directus файлы сохранились.

## 2. Что есть сейчас

На VPS находятся три независимых Docker Compose-проекта:

```text
VPS root
├── front/
│   ├── docker-compose.yaml
│   └── parks-2/                 # Git-репозиторий parki-2
├── directus/
│   ├── docker-compose.yaml
│   ├── snapshot.yaml
│   └── uploads/
└── database/
    └── docker-compose.yaml
```

Сервисы:

- `parks-front` — Next.js, опубликован на порту `3020`;
- `directus` — Directus 11.3.5, опубликован на порту `8055`;
- `database` — PostgreSQL/PostGIS 14, опубликован на порту `5432`;
- `pgadmin` — pgAdmin, опубликован на порту `5050`;
- Apache httpd установлен непосредственно на VPS и находится вне Docker Compose;
  внешний TLS завершается на инфраструктуре хостинг-провайдера.

Directus и PostgreSQL связаны внешней Docker-сетью `my-app-network`. Frontend в эту сеть не включён и сейчас обращается к Directus по публичному адресу.

## 3. Целевая архитектура

Рекомендуется оставить одно приложение Next.js и один frontend-контейнер:

```text
парки.рф ───────────────────────┐
                               ├─> Apache или Caddy ─> parks-front:3000
<поддомен>.парки.рф ────────────┘                         │
                                                         └─> directus:8055
                                                               │
                                                               └─> database:5432
```

Основной домен и поддомен приходят в один контейнер `parks-front`. Next.js определяет нужную страницу по заголовку `Host`:

- `парки.рф` — существующий сайт;
- `<поддомен>.парки.рф` — внутренний маршрут `/nedelka`.

Отдельное Next.js-приложение и второй frontend-контейнер для лендинга не нужны.

## 4. Структура лендинга в Next.js

Предлагаемая структура:

```text
app/
  nedelka/
    layout.jsx
    page.jsx

components/
  nedelka/
    NedelkaPage.jsx
    NedelkaHeader.jsx
    NedelkaHero.jsx
    NedelkaManifest.jsx
    NedelkaPracticals.jsx
    NedelkaPartners.jsx
    NedelkaFinalCta.jsx
    NedelkaClient.jsx

lib/
  nedelka.js

styles/
  nedelka.css

public/
  nedelka/
    makers-logo.png
    parks-logo.png

middleware.js
```

### Ответственность файлов

- `app/nedelka/page.jsx` — серверная загрузка данных Directus и сборка страницы;
- `app/nedelka/layout.jsx` — metadata, canonical URL и корневой класс лендинга;
- `components/nedelka/*` — React-компоненты отдельных блоков;
- `NedelkaClient.jsx` — только браузерная интерактивность: анимация, toast и будущий popup;
- `lib/nedelka.js` — запросы к Directus и нормализация данных;
- `styles/nedelka.css` — изолированные стили лендинга;
- `middleware.js` — маршрутизация по hostname;
- `public/nedelka/*` — постоянные брендовые материалы.

Статический `script.js` из переданного пакета не следует переносить буквально. Карточки нужно выводить через React, без генерации HTML через `innerHTML`.

## 5. Маршрутизация поддомена

Внутри Next.js создаётся маршрут `/nedelka`. Middleware проверяет hostname входящего запроса и выполняет внутренний rewrite:

```text
https://<поддомен>.парки.рф/ → внутренний маршрут /nedelka
```

Адрес в браузере остаётся адресом поддомена.

Middleware не должен переписывать:

- `/_next/*`;
- статические файлы;
- favicon;
- robots.txt;
- sitemap.xml;
- API endpoints, которым нужен собственный маршрут.

На основном домене `/nedelka` можно перенаправлять на канонический адрес поддомена.

Официальная документация: [Next.js Middleware](https://nextjs.org/docs/15/pages/api-reference/file-conventions/middleware).

## 6. Коллекции Directus

### 6.1. `nedelkaPage`

Singleton с общими настройками страницы:

- `enabled`;
- `heroEyebrow`;
- `heroTitle`;
- `heroDescription`;
- `heroCtaLabel`;
- `manifestTitle`;
- `manifestText`;
- `practicalsTitle`;
- `partnersTitle`;
- `finalCtaTitle`;
- `finalCtaLabel`;
- `metaTitle`;
- `metaDescription`;
- `ogImage`.

### 6.2. `nedelkaBenefits`

- `status`: `draft`, `published`, `archived`;
- `sort`;
- `title`;
- `description`;
- связь с `nedelkaPage`.

### 6.3. `nedelkaPracticals`

- `status`: `draft`, `published`, `archived`;
- `sort`;
- `expertName`;
- `expertMeta`;
- `expertPhoto`;
- `topic`;
- `kind`: `recording` или `upcoming`;
- `eventDate`;
- `price`;
- `currency`;
- `statusLabel`;
- `ctaLabel`;
- `actionUrl`;
- `openInNewTab`.

До появления полноценной платёжной интеграции поле `actionUrl` используется как обычная ссылка на регистрацию или внешний checkout.

### 6.4. `nedelkaPartners`

- `status`: `draft`, `published`, `archived`;
- `sort`;
- `name`;
- `logo`;
- `url`;
- `altText`.

Логотипы «Парков России» и «Мэйкерс» рекомендуется хранить в Git как часть дизайна. Фото экспертов и логотипы партнёров — в Directus.

## 7. Доступ к Directus

Данные лендинга должны загружаться серверным компонентом Next.js:

```text
Directus → Next.js Server Component → HTML → браузер
```

Браузер не должен получать статический Directus-токен.

Рекомендуемые переменные окружения:

```dotenv
DIRECTUS_INTERNAL_URL=http://directus:8055
DIRECTUS_PUBLIC_URL=https://админ.парки.рф
```

- `DIRECTUS_INTERNAL_URL` используется контейнером Next.js для API-запросов;
- `DIRECTUS_PUBLIC_URL` используется для публичных URL изображений.

Для Public Role в Directus следует разрешить только:

- чтение опубликованных записей нужных коллекций;
- чтение конкретных полей;
- чтение файлов, используемых лендингом.

Не следует передавать статический Directus-токен в query-параметрах изображений.

Официальная документация: [Directus SDK](https://docs.directus.io/guides/sdk/getting-started) и [Directus Public Role](https://docs.directus.io/getting-started/quickstart).

## 8. Обновление контента

### Базовый вариант

Next.js кеширует данные лендинга и обновляет их раз в 60 секунд.

Преимущества:

- простая реализация;
- Directus не вызывается при каждом открытии страницы;
- кратковременная недоступность Directus не обязательно ломает уже закешированную страницу.

### Продвинутый вариант

После публикации записи Directus Flow вызывает защищённый Next.js Route Handler. Он запускает `revalidatePath` или `revalidateTag`, и изменения появляются сразу.

Начинать рекомендуется с обновления раз в 60 секунд. Webhook можно добавить вторым этапом.

Документация: [Next.js Caching](https://nextjs.org/docs/15/app/guides/caching).

## 9. Объединение Docker Compose

Все сервисы можно описать одним `compose.yaml` в корне репозитория `parks-2`:

```text
parks-2/
├── compose.yaml
├── Dockerfile
├── .env.example
├── deploy/
│   ├── directus/
│   │   └── snapshot.yaml
│   ├── apache/
│   │   └── parks.conf
│   └── Caddyfile
└── исходники Next.js
```

В Git хранятся:

- `compose.yaml`;
- Dockerfile;
- Directus schema snapshot;
- `.env.example` без значений;
- конфигурация reverse proxy;
- deploy-скрипт.

В Git не хранятся:

- `.env`;
- база данных;
- Directus uploads;
- пароли и токены;
- TLS private keys.

## 10. Критический риск: существующие volumes

Текущие Compose-файлы используют named volumes:

```yaml
database:/var/lib/postgresql/data
uploads:/directus/uploads
```

Реальные имена могут выглядеть как `database_database` и `directus_uploads`, но их необходимо определить командами:

```bash
docker compose ls
docker volume ls

docker inspect database \
  --format '{{range .Mounts}}{{println .Type .Name .Source "->" .Destination}}{{end}}'

docker inspect directus \
  --format '{{range .Mounts}}{{println .Type .Name .Source "->" .Destination}}{{end}}'
```

В новом Compose существующие volumes подключаются как внешние:

```yaml
volumes:
  postgres_data:
    external: true
    name: ${POSTGRES_VOLUME_NAME}

  directus_uploads:
    external: true
    name: ${DIRECTUS_UPLOADS_VOLUME_NAME}
```

Это не даст Compose создать новые пустые тома.

Нельзя выполнять:

```bash
docker compose down -v
```

пока не сделаны резервные копии и не подтверждены имена томов.

Документация: [Docker Compose volumes](https://docs.docker.com/reference/compose-file/volumes/).

## 11. Предварительная структура единого Compose

Это пример целевой структуры, а не готовый файл для запуска до проверки volumes:

```yaml
name: parks

services:
  database:
    image: postgis/postgis:14-master
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend

  directus:
    image: directus/directus:11.3.5
    restart: unless-stopped
    env_file:
      - .env
    depends_on:
      - database
    volumes:
      - directus_uploads:/directus/uploads
    ports:
      - "127.0.0.1:8055:8055"
    networks:
      - frontend
      - backend

  parks-front:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file:
      - .env
    depends_on:
      - directus
    ports:
      - "127.0.0.1:3020:3000"
    networks:
      - frontend

  pgadmin:
    image: dpage/pgadmin4
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "127.0.0.1:5050:80"
    networks:
      - backend
    profiles:
      - tools

networks:
  frontend:
  backend:

volumes:
  postgres_data:
    external: true
    name: ${POSTGRES_VOLUME_NAME}

  directus_uploads:
    external: true
    name: ${DIRECTUS_UPLOADS_VOLUME_NAME}
```

В одном Compose отдельная внешняя сеть `my-app-network` больше не нужна. Сервисы доступны друг другу по именам `database`, `directus` и `parks-front`.

Поле `version` в современном Compose устарело и в новом файле не требуется.

Документация: [Docker Compose Networking](https://docs.docker.com/compose/how-tos/networking/) и [Compose version element](https://docs.docker.com/reference/compose-file/version-and-name/).

## 12. Production Dockerfile frontend

Текущий Dockerfile запускает `npm run dev`. Для production требуется:

- multi-stage build;
- установка зависимостей через `npm ci`;
- выполнение `npm run build`;
- запуск через `npm run start`;
- production environment;
- healthcheck.

Желательно использовать Next.js standalone output для уменьшения финального образа.

## 13. Apache на первом этапе

На первом этапе рекомендуется оставить существующий host Apache.

Маршрутизация:

```text
парки.рф                 → 127.0.0.1:3020
<поддомен>.парки.рф      → 127.0.0.1:3020
админ.парки.рф           → 127.0.0.1:8055
```

Для работы маршрутизации Next.js Apache должен сохранять исходный hostname:

```apache
ProxyPreserveHost On
ProxyPass / http://127.0.0.1:3020/
ProxyPassReverse / http://127.0.0.1:3020/
```

Фактическую схему `X-Forwarded-Proto` нужно сверить с конфигурацией внешнего
TLS-прокси хостинг-провайдера.

Посмотреть действующую конфигурацию Apache:

```bash
httpd -S
httpd -t
```

## 14. Возможный переход на Caddy

Caddy можно запустить в том же Compose:

```yaml
caddy:
  image: caddy:2
  restart: unless-stopped
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./deploy/Caddyfile:/etc/caddy/Caddyfile:ro
    - caddy_data:/data
    - caddy_config:/config
  networks:
    - frontend
```

Домены и upstream-сервисы задаются в `Caddyfile`:

```caddyfile
парки.рф {
    reverse_proxy parks-front:3000
}

<поддомен>.парки.рф {
    reverse_proxy parks-front:3000
}

админ.парки.рф {
    reverse_proxy directus:8055
}
```

Для кириллических доменов в итоговой конфигурации рекомендуется использовать punycode.

Caddy автоматически получает и обновляет TLS-сертификаты при корректном DNS и доступных портах 80/443.

Compose запускает Caddy и подключает конфигурацию, но правила доменов обычно хранятся в отдельном `Caddyfile`. Конфигурация только через Docker labels требует дополнительного стороннего плагина и для этого проекта не нужна.

Документация: [Caddy Automatic HTTPS](https://caddyserver.com/docs/automatic-https).

### Рекомендация по reverse proxy

1. Сначала объединить frontend, Directus и PostgreSQL.
2. Оставить существующий Apache.
3. Проверить основной сайт, админку, базу и изображения.
4. Добавить лендинг и поддомен.
5. Только после стабилизации решать, переносить ли proxy в Docker и заменять ли Apache на Caddy.

## 15. Версионирование схемы Directus

После создания коллекций следует экспортировать schema snapshot:

```text
deploy/directus/snapshot.yaml
```

Snapshot содержит:

- коллекции;
- поля;
- связи;
- настройки модели данных.

Snapshot не содержит контент и загруженные файлы.

Во время deployment схема применяется командой Directus `schema apply`. Перед автоматизацией следует проверить изменения через dry run.

Документация: [Directus CLI](https://docs.directus.io/self-hosted/cli).

## 16. Безопасность

Если опубликованные ранее пароли и ключи были настоящими, необходимо заменить:

- Directus `KEY` и `SECRET`;
- пароль PostgreSQL;
- пароль администратора Directus;
- SMTP-пароль;
- пароль pgAdmin.

Если показанные значения были заранее заменены на заглушки, менять ничего
из-за переписки не требуется.

Дополнительные меры:

- хранить секреты только в серверном `.env`;
- добавить `.env` в `.gitignore`;
- хранить в Git только `.env.example` без значений;
- убрать публикацию PostgreSQL `5432:5432` наружу;
- Directus и pgAdmin привязывать к `127.0.0.1`, если их проксирует host Apache;
- не передавать Directus-токен браузеру;
- после первичного bootstrap убрать `ADMIN_EMAIL` и `ADMIN_PASSWORD` из постоянного runtime-конфига;
- не обновлять одновременно версии Directus/PostgreSQL и структуру Compose.

## 17. Единый deployment

После завершения миграции обновление должно состоять из следующих действий:

```text
git pull --ff-only
проверка и применение Directus schema snapshot
docker compose up -d --build
healthcheck и smoke-check доменов
```

Это можно оформить одной командой:

```bash
./deploy.sh
```

или:

```bash
make deploy
```

## 18. Безопасный порядок миграции Compose

1. Узнать фактические имена volumes PostgreSQL и Directus.
2. Проверить текущую Docker-сеть.
3. Сделать дамп PostgreSQL.
4. Сделать архив Directus uploads.
5. Сохранить конфигурацию Apache и вывод `httpd -S`/`httpd -t`.
6. Создать единый `compose.yaml` в репозитории.
7. Проверить итоговую конфигурацию через `docker compose config`.
8. Подключить существующие volumes как external.
9. Остановить старые контейнеры без удаления volumes.
10. Запустить новый Compose.
11. Проверить базу, Directus, изображения и основной сайт.
12. Подключить лендинг и поддомен.
13. Проверить desktop/mobile, metadata и кеширование.
14. Только после полной проверки удалить старые Compose-файлы.

## 19. Этапы разработки лендинга

1. Получить точное имя поддомена.
2. Создать коллекции Directus.
3. Экспортировать schema snapshot.
4. Перенести статический лендинг в React-компоненты.
5. Подключить серверные запросы Directus.
6. Добавить обработку пустых и неопубликованных данных.
7. Изолировать стили от глобального CSS сайта.
8. Добавить host-based middleware.
9. Переделать Dockerfile под production.
10. Добавить поддомен в DNS, Apache и TLS.
11. Выполнить функциональную и адаптивную проверку.
12. Оформить единую deploy-команду.

## 20. Что нужно получить с VPS перед составлением финального Compose

```bash
docker compose ls
docker volume ls

docker inspect database \
  --format '{{range .Mounts}}{{println .Type .Name .Source "->" .Destination}}{{end}}'

docker inspect directus \
  --format '{{range .Mounts}}{{println .Type .Name .Source "->" .Destination}}{{end}}'

docker network inspect my-app-network

httpd -S
httpd -t
```

После получения этой информации можно подготовить точный `compose.yaml`, который подхватит существующие данные без их переноса или потери.
