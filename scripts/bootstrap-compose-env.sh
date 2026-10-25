#!/usr/bin/env bash

set -Eeuo pipefail

REPOSITORY_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$REPOSITORY_DIR/.env"
ENV_EXAMPLE_FILE="$REPOSITORY_DIR/.env.example"

cd "$REPOSITORY_DIR"

for container in database directus pgadmin; do
  if ! docker inspect "$container" >/dev/null 2>&1; then
    echo "Required running container not found: $container" >&2
    exit 1
  fi
done

if [[ -e "$ENV_FILE" ]] && ! cmp -s "$ENV_FILE" "$ENV_EXAMPLE_FILE"; then
  echo ".env already exists and differs from .env.example; refusing to overwrite it." >&2
  exit 1
fi

container_env() {
  local container="$1"
  local variable="$2"

  docker inspect "$container" \
    --format '{{range .Config.Env}}{{println .}}{{end}}' \
    | awk -v prefix="$variable=" '
        index($0, prefix) == 1 {
          print substr($0, length(prefix) + 1)
          found = 1
          exit
        }
        END {
          if (!found) exit 1
        }
      '
}

dotenv_quote() {
  local value="$1"
  value="${value//\'/\\\'}"
  printf "'%s'" "$value"
}

append_container_env() {
  local target_variable="$1"
  local container="$2"
  local source_variable="$3"
  local value

  if ! value="$(container_env "$container" "$source_variable")"; then
    echo "Missing $source_variable in container $container" >&2
    return 1
  fi

  printf '%s=' "$target_variable"
  dotenv_quote "$value"
  printf '\n'
}

POSTGRES_USER_CURRENT="$(container_env database POSTGRES_USER)"
POSTGRES_DB_CURRENT="$(container_env database POSTGRES_DB)"
DIRECTUS_DB_USER_CURRENT="$(container_env directus DB_USER)"
DIRECTUS_DB_CURRENT="$(container_env directus DB_DATABASE)"

if [[ "$POSTGRES_USER_CURRENT" != "$DIRECTUS_DB_USER_CURRENT" ]]; then
  echo "Directus DB_USER differs from PostgreSQL POSTGRES_USER; manual migration is required." >&2
  exit 1
fi

if [[ "$POSTGRES_DB_CURRENT" != "$DIRECTUS_DB_CURRENT" ]]; then
  echo "Directus DB_DATABASE differs from PostgreSQL POSTGRES_DB; manual migration is required." >&2
  exit 1
fi

TEMP_ENV_FILE="$(mktemp "$REPOSITORY_DIR/.env.tmp.XXXXXX")"
trap 'rm -f "$TEMP_ENV_FILE"' EXIT

{
  printf '%s\n' \
    'POSTGRES_IMAGE=postgis/postgis:14-master@sha256:f64aa9025759ec0a562f94fa6af57cf0aa08e85606875ca4256505a0775b37ce' \
    'DIRECTUS_IMAGE=directus/directus:11.3.5@sha256:6bc79ef2f0daa224d84b4da22ea3831e60697d399589d54067cb3681c2f94514' \
    'PGADMIN_IMAGE=dpage/pgadmin4:latest@sha256:bdebdfc4b165c10d0ad60e58f1d7ef41af6c881c9556ae331adaa35bba6dacf3' \
    'FRONT_IMAGE=parks-front:compose' \
    ''

  append_container_env POSTGRES_USER database POSTGRES_USER
  append_container_env POSTGRES_PASSWORD database POSTGRES_PASSWORD
  append_container_env POSTGRES_DB database POSTGRES_DB
  printf '\n'

  append_container_env DIRECTUS_KEY directus KEY
  append_container_env DIRECTUS_SECRET directus SECRET
  append_container_env DIRECTUS_DB_PASSWORD directus DB_PASSWORD
  append_container_env DIRECTUS_ADMIN_EMAIL directus ADMIN_EMAIL
  append_container_env DIRECTUS_ADMIN_PASSWORD directus ADMIN_PASSWORD
  printf '\n'

  append_container_env SMTP_FROM directus EMAIL_FROM
  append_container_env SMTP_HOST directus EMAIL_SMTP_HOST
  append_container_env SMTP_PORT directus EMAIL_SMTP_PORT
  append_container_env SMTP_USER directus EMAIL_SMTP_USER
  append_container_env SMTP_PASSWORD directus EMAIL_SMTP_PASSWORD
  append_container_env SMTP_SECURE directus EMAIL_SMTP_SECURE
  printf '\n'

  append_container_env PGADMIN_DEFAULT_EMAIL pgadmin PGADMIN_DEFAULT_EMAIL
  append_container_env PGADMIN_DEFAULT_PASSWORD pgadmin PGADMIN_DEFAULT_PASSWORD
  printf '\n'

  printf '%s\n' \
    'POSTGRES_VOLUME_NAME=database_database' \
    'DIRECTUS_UPLOADS_VOLUME_NAME=directus_uploads' \
    'PGADMIN_VOLUME_NAME=47233f4cee1a135dbfdf21c15d1911b4b6d0cb37092d1765003b26ce21bc3cd4' \
    'DOCKER_NETWORK_NAME=my-app-network'
} > "$TEMP_ENV_FILE"

chmod 600 "$TEMP_ENV_FILE"
mv -f "$TEMP_ENV_FILE" "$ENV_FILE"
trap - EXIT

echo "Created $ENV_FILE from the current running containers."
echo "No secret values were printed."
