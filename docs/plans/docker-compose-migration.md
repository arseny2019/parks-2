# План объединения Docker Compose для parki-2

> Статус: выполнено 26 октября 2026 года. Это исходный рабочий план;
> фактический результат и оставшиеся задачи зафиксированы в
> [статусе миграции](../operations/migration-status.md) и
> [техническом долге](../operations/technical-debt.md).

## 1. Цель миграции

Объединить существующие Compose-проекты frontend, Directus, PostgreSQL и pgAdmin в один `compose.yaml`, расположенный в репозитории `parki-2`.

После миграции должно быть возможно:

```bash
git pull --ff-only
docker compose up -d --build
```

При этом должны сохраниться:

- существующая база PostgreSQL/PostGIS;
- все коллекции и настройки Directus;
- загруженные в Directus файлы;
- текущие домены и Apache httpd;
- существующие порты frontend и Directus;
- возможность быстрого возврата к старым Compose-файлам.

## 2. Что не входит в эту миграцию

Чтобы уменьшить риск, на этом этапе не выполняются:

- интеграция лендинга «НЕДЕЛЬКА»;
- изменение структуры коллекций Directus;
- применение нового Directus schema snapshot;
- обновление версии Directus;
- обновление PostgreSQL/PostGIS;
- изменение frontend Dockerfile и переход с `next dev` на production build;
- перенос reverse proxy в Docker;
- замена Apache на Caddy;
- изменение доменов и TLS-сертификатов;
- рефакторинг приложения Next.js;
- ротация секретов, если опубликованные ранее значения были заглушками.

Миграция должна менять только способ оркестрации уже работающих сервисов.

## 3. Текущее состояние

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

Текущие сервисы:

- `parks-front` — Next.js, host port `3020`;
- `directus` — Directus 11.3.5, host port `8055`;
- `database` — PostgreSQL/PostGIS 14, host port `5432`;
- `pgadmin` — pgAdmin, host port `5050`;
- host Apache httpd — reverse proxy вне Docker; внешний TLS завершается на
  инфраструктуре хостинг-провайдера.

Directus и PostgreSQL подключены к внешней сети `my-app-network`. Frontend работает в отдельной сети своего Compose-проекта.

## 4. Целевое состояние

В корне Git-репозитория `parks-2`:

```text
parks-2/
├── compose.yaml
├── .env.example
├── .env                       # только на VPS, не в Git
├── Dockerfile
├── docs/
│   ├── plans/
│   └── operations/
└── исходники приложения
```

Один Compose-проект с фиксированным именем `parks`:

```text
parks-front ── frontend network ── directus
                                      │
                                      └── backend network ── database
                                                              │
                                                           pgadmin
```

Host Apache продолжает подключаться к:

- `127.0.0.1:3020` — frontend;
- `127.0.0.1:8055` — Directus;
- `127.0.0.1:5050` — pgAdmin, если он нужен.

PostgreSQL больше не публикуется во внешний интерфейс VPS. Контейнеры обращаются к нему по адресу `database:5432`.

## 5. Главный риск: volumes

Текущие Compose-файлы используют named volumes:

```yaml
database:/var/lib/postgresql/data
uploads:/directus/uploads
```

Фактические Docker-имена зависят от имени старого Compose-проекта. Они могут выглядеть как:

```text
database_database
directus_uploads
```

Это только предположение. До миграции необходимо определить реальные имена.

Если в новом Compose указать обычные volumes без `external`, Docker создаст новые пустые тома. Тогда Directus покажется пустым, хотя старые данные останутся в прежних volumes.

Существующие volumes должны быть подключены так:

```yaml
volumes:
  postgres_data:
    external: true
    name: ${POSTGRES_VOLUME_NAME}

  directus_uploads:
    external: true
    name: ${DIRECTUS_UPLOADS_VOLUME_NAME}
```

## 6. Фаза 0 — правила безопасности

До завершения миграции:

- не выполнять `docker compose down -v`;
- не удалять Docker volumes;
- не запускать два контейнера PostgreSQL с одним data volume одновременно;
- не обновлять образы Directus и PostgreSQL;
- не удалять старые Compose-файлы;
- не менять Apache;
- не применять schema snapshot;
- не выполнять `docker system prune --volumes`;
- не коммитить `.env`.

Если ранее показанные пароли и ключи были настоящими, их необходимо считать раскрытыми. Их ротацию следует провести контролируемо, отдельно от этой миграции либо немедленно, если есть риск внешнего доступа.

## 7. Фаза 1 — инвентаризация VPS

### 7.1. Зафиксировать Compose-проекты и контейнеры

```bash
docker compose ls

docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
```

Сохранить вывод в заметки миграции.

### 7.2. Определить фактические volumes

```bash
docker volume ls

docker inspect database \
  --format '{{range .Mounts}}{{println .Type .Name .Source "->" .Destination}}{{end}}'

docker inspect directus \
  --format '{{range .Mounts}}{{println .Type .Name .Source "->" .Destination}}{{end}}'
```

Зафиксировать:

```text
POSTGRES_VOLUME_NAME=<фактическое имя>
DIRECTUS_UPLOADS_VOLUME_NAME=<фактическое имя>
```

Проверить каждый volume:

```bash
docker volume inspect <имя-volume>
```

### 7.3. Проверить сеть

```bash
docker network inspect my-app-network
```

Нужно убедиться, что в ней находятся как минимум `directus` и `database`.

### 7.4. Зафиксировать образы

```bash
docker inspect database --format '{{.Config.Image}}'
docker inspect directus --format '{{.Config.Image}}'
docker inspect parks-front --format '{{.Config.Image}}'
docker inspect pgadmin --format '{{.Config.Image}}'
```

Дополнительно сохранить image IDs:

```bash
docker image inspect postgis/postgis:14-master --format '{{.Id}} {{json .RepoDigests}}'
docker image inspect directus/directus:11.3.5 --format '{{.Id}} {{json .RepoDigests}}'
```

Во время миграции используются те же версии и теги.

### 7.5. Сохранить конфигурацию Apache

```bash
httpd -S
httpd -t
```

Проверить, что frontend и Directus действительно проксируются на текущие порты `3020` и `8055`.

## 8. Фаза 2 — резервные копии

Перед остановкой контейнеров нужно создать две независимые резервные копии.

### 8.1. Создать директорию backup

```bash
MIGRATION_BACKUP_DIR="$(pwd)/compose-migration-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$MIGRATION_BACKUP_DIR"
chmod 700 "$MIGRATION_BACKUP_DIR"
```

Не размещать backup внутри Git-репозитория.

### 8.2. Сохранить текущие конфигурации

Скопировать в backup:

- `front/docker-compose.yaml`;
- `directus/docker-compose.yaml`;
- `database/docker-compose.yaml`;
- используемые `.env`, если они существуют;
- `directus/snapshot.yaml`;
- каталог `/etc/httpd`, вывод `httpd -S` и `httpd -t`.

Файлы с секретами должны иметь права `600` и не должны попадать в Git.

### 8.3. Сделать дамп PostgreSQL

```bash
docker exec database pg_dump \
  -U parks \
  -d parksDB \
  -Fc > "$MIGRATION_BACKUP_DIR/parksDB.dump"
```

Проверить, что дамп существует и не пустой:

```bash
ls -lh "$MIGRATION_BACKUP_DIR/parksDB.dump"
```

Проверить читаемость дампа:

```bash
docker exec -i database pg_restore -l \
  < "$MIGRATION_BACKUP_DIR/parksDB.dump" \
  > "$MIGRATION_BACKUP_DIR/parksDB.contents.txt"
```

### 8.4. Сделать архив Directus uploads

После определения настоящего имени volume:

```bash
DIRECTUS_UPLOADS_VOLUME_NAME="<фактическое имя>"

docker run --rm \
  -v "$DIRECTUS_UPLOADS_VOLUME_NAME:/source:ro" \
  -v "$MIGRATION_BACKUP_DIR:/backup" \
  alpine \
  tar -czf /backup/directus-uploads.tar.gz -C /source .
```

Проверить архив:

```bash
ls -lh "$MIGRATION_BACKUP_DIR/directus-uploads.tar.gz"
tar -tzf "$MIGRATION_BACKUP_DIR/directus-uploads.tar.gz" | head
```

## 9. Фаза 3 — подготовка файлов в Git

В репозитории создаются:

```text
compose.yaml
.env.example
```

В `.gitignore` должно присутствовать:

```gitignore
.env
.env.*
!.env.example
```

### 9.1. `.env.example`

Файл содержит только имена переменных:

```dotenv
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

DIRECTUS_KEY=
DIRECTUS_SECRET=
DIRECTUS_ADMIN_EMAIL=
DIRECTUS_ADMIN_PASSWORD=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=

POSTGRES_VOLUME_NAME=
DIRECTUS_UPLOADS_VOLUME_NAME=
```

### 9.2. Серверный `.env`

На VPS в корне репозитория создаётся `.env` с текущими рабочими значениями.

```bash
chmod 600 .env
```

Значения во время первой миграции должны соответствовать текущим Compose-файлам. Не следует одновременно менять пароли и структуру Compose.

## 10. Фаза 4 — структура нового compose.yaml

Предварительная структура:

```yaml
name: parks

services:
  database:
    image: postgis/postgis:14-master
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend

  directus:
    image: directus/directus:11.3.5
    restart: unless-stopped
    depends_on:
      - database
    environment:
      KEY: ${DIRECTUS_KEY}
      SECRET: ${DIRECTUS_SECRET}
      DB_CLIENT: postgres
      DB_HOST: database
      DB_PORT: 5432
      DB_DATABASE: ${POSTGRES_DB}
      DB_USER: ${POSTGRES_USER}
      DB_PASSWORD: ${POSTGRES_PASSWORD}
      ADMIN_EMAIL: ${DIRECTUS_ADMIN_EMAIL}
      ADMIN_PASSWORD: ${DIRECTUS_ADMIN_PASSWORD}
      EMAIL_TRANSPORT: smtp
      EMAIL_SMTP_HOST: ${SMTP_HOST}
      EMAIL_SMTP_PORT: ${SMTP_PORT}
      EMAIL_SMTP_USER: ${SMTP_USER}
      EMAIL_SMTP_PASSWORD: ${SMTP_PASSWORD}
      EMAIL_SMTP_SECURE: "false"
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
    depends_on:
      - directus
    ports:
      - "127.0.0.1:3020:3000"
    networks:
      - frontend

  pgadmin:
    image: dpage/pgadmin4
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_DEFAULT_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_DEFAULT_PASSWORD}
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

Это шаблон. Перед использованием его необходимо сверить со всеми текущими переменными Directus.

### Почему PostgreSQL не имеет `ports`

Directus обращается к базе внутри Docker-сети по адресу `database:5432`. Публикация PostgreSQL на всех интерфейсах VPS не требуется.

Если прямой доступ к PostgreSQL временно нужен, использовать только loopback:

```yaml
ports:
  - "127.0.0.1:5432:5432"
```

и подключаться через SSH tunnel.

### Почему Apache пока остаётся снаружи

Это сохраняет текущие домены, TLS и reverse proxy без изменений. На этом этапе меняется только Docker-оркестрация.

## 11. Фаза 5 — статическая проверка нового Compose

В корне репозитория:

```bash
docker compose config --quiet
```

Затем вывести итоговую конфигурацию:

```bash
docker compose config
```

Проверить:

- подставились ли все переменные;
- совпадают ли `DB_DATABASE`, `DB_USER` и пароль;
- правильные ли external volume names;
- frontend собирается из текущего каталога;
- host-порты привязаны к `127.0.0.1`;
- PostgreSQL не опубликован наружу;
- в итоговом выводе нет пустых критических переменных.

Проверить существование external volumes:

```bash
docker volume inspect "$POSTGRES_VOLUME_NAME"
docker volume inspect "$DIRECTUS_UPLOADS_VOLUME_NAME"
```

## 12. Фаза 6 — репетиция без данных production

Желательно до переключения выполнить пробный запуск на копиях данных или отдельной VPS.

Минимальный вариант:

1. восстановить дамп PostgreSQL в отдельный тестовый volume;
2. восстановить uploads в отдельный тестовый volume;
3. запустить Compose с другим project name и другими host ports;
4. проверить Directus и frontend;
5. удалить только тестовые контейнеры и тестовые volumes.

Если отдельная репетиция невозможна, переходить к controlled cutover только при наличии проверенных backup.

## 13. Фаза 7 — controlled cutover

Запланировать короткое окно обслуживания. Во время переключения не изменять контент в Directus.

### 13.1. Зафиксировать состояние перед остановкой

```bash
docker ps
docker volume ls
```

### 13.2. Остановить старые контейнеры

Старые Compose-проекты останавливаются без `-v`.

Порядок:

1. frontend;
2. Directus;
3. pgAdmin;
4. PostgreSQL.

Можно использовать `docker compose stop` в каждой старой директории. Старые контейнеры на первом этапе лучше не удалять: это упрощает rollback.

### 13.3. Убедиться, что старый PostgreSQL остановлен

```bash
docker ps --filter name=database
```

Нельзя запускать новый PostgreSQL, пока старый контейнер использует тот же data volume.

### 13.4. Запустить новый Compose

Из корня `parks-2`:

```bash
docker compose up -d --build
```

Если pgAdmin нужен:

```bash
docker compose --profile tools up -d --build
```

### 13.5. Проверить контейнеры

```bash
docker compose ps
docker compose logs --tail=200 database
docker compose logs --tail=200 directus
docker compose logs --tail=200 parks-front
```

## 14. Фаза 8 — проверки после запуска

### 14.1. PostgreSQL

```bash
docker compose exec database pg_isready \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB"
```

Проверить наличие таблиц:

```bash
docker compose exec database psql \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  -c '\dt'
```

### 14.2. Directus

Проверить:

- открывается ли админка;
- работает ли вход существующего администратора;
- присутствуют ли коллекции;
- присутствуют ли записи;
- открываются ли изображения и файлы;
- нет ли ошибок подключения к БД;
- нет ли ошибок прав на `/directus/uploads`.

Локальная проверка с VPS:

```bash
curl -I http://127.0.0.1:8055/server/health
```

### 14.3. Frontend

```bash
curl -I http://127.0.0.1:3020
```

Проверить через публичный домен:

```bash
curl -I https://парки.рф
```

Дополнительно открыть вручную:

- главную страницу;
- проекты;
- новости;
- регионы;
- страницы, использующие изображения Directus;
- форму обратной связи.

### 14.4. Apache

Apache на этом этапе не меняется, но нужно проверить:

```bash
httpd -t
```

### 14.5. Проверка портов

```bash
sudo ss -lntp
```

Ожидается:

- `127.0.0.1:3020`;
- `127.0.0.1:8055`;
- опционально `127.0.0.1:5050`;
- отсутствие публичного `0.0.0.0:5432`.

## 15. Критерии успешной миграции

Миграция считается успешной, если:

- все сервисы запускаются одним `docker compose up`;
- основной сайт отвечает через прежний домен;
- Directus открывается через прежний домен;
- существующий пользователь может войти в Directus;
- все коллекции и записи сохранены;
- все загруженные изображения открываются;
- frontend получает данные Directus;
- PostgreSQL использует прежний data volume;
- Directus использует прежний uploads volume;
- Apache не потребовал изменения;
- PostgreSQL больше не опубликован наружу;
- в логах нет циклических перезапусков и ошибок подключения;
- старые Compose-проекты можно запустить обратно при необходимости.

## 16. План отката

Если новый Compose не проходит проверки:

### 16.1. Остановить новый Compose

```bash
docker compose down
```

Не добавлять `-v`.

### 16.2. Запустить старые проекты

В порядке:

1. старый database Compose;
2. старый Directus Compose;
3. старый frontend Compose;
4. старый pgAdmin Compose, если требуется.

### 16.3. Проверить прежние домены

Поскольку Apache и порты не менялись, после запуска старых контейнеров трафик должен вернуться к прежней схеме.

### 16.4. Восстановление из backup

Восстановление дампа или uploads выполняется только если данные действительно повреждены. Обычный rollback Compose не требует восстановления: старые и новые контейнеры используют те же external volumes.

## 17. Период наблюдения

После успешного переключения не удалять старые Compose-файлы и старую сеть минимум 24–48 часов.

В этот период проверять:

```bash
docker compose ps
docker compose logs --since=1h database
docker compose logs --since=1h directus
docker compose logs --since=1h parks-front
```

Также проверить:

- создание и редактирование записи Directus;
- загрузку нового файла;
- отправку почты Directus;
- перезапуск всей группы после `docker compose restart`;
- запуск после перезагрузки VPS.

## 18. Фаза 9 — уборка после стабилизации

Только после периода наблюдения:

1. архивировать старые Compose-файлы;
2. удалить остановленные старые контейнеры;
3. убедиться, что volumes объявлены external в новом Compose;
4. проверить, что `my-app-network` больше не используется;
5. при необходимости удалить старую сеть;
6. не удалять PostgreSQL и uploads volumes;
7. сохранить backup в отдельном защищённом месте.

Команда проверки использования сети:

```bash
docker network inspect my-app-network
```

Удалять сеть можно только при отсутствии подключённых контейнеров.

## 19. Единая команда обновления после миграции

После стабилизации базовый deployment:

```bash
git pull --ff-only
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

Позже эти команды можно поместить в `deploy.sh`, но создание скрипта лучше делать после успешной ручной миграции.

## 20. Отдельные последующие задачи

После успешной миграции каждая из следующих задач выполняется отдельно:

1. production Dockerfile для Next.js;
2. healthchecks и `depends_on: condition: service_healthy`;
3. фиксация точных image tags/digests;
4. Directus schema snapshot в Git;
5. ротация и упорядочивание секретов;
6. перенос reverse proxy в Compose либо переход с Apache на Caddy;
7. интеграция лендинга «НЕДЕЛЬКА»;
8. подключение поддомена;
9. платёжная интеграция.

## 21. Данные, необходимые перед созданием финального compose.yaml

Нужно получить результаты:

```bash
docker compose ls
docker volume ls

docker inspect database \
  --format '{{range .Mounts}}{{println .Type .Name .Source "->" .Destination}}{{end}}'

docker inspect directus \
  --format '{{range .Mounts}}{{println .Type .Name .Source "->" .Destination}}{{end}}'

docker network inspect my-app-network

docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
```

Также нужны относящиеся к проекту VirtualHost-файлы Apache и вывод
`httpd -S`, чтобы подтвердить текущие upstream ports. Секреты и приватные
ключи передавать не нужно.
