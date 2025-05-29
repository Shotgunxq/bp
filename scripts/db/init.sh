set -e

# run against the DB you declared in docker-compose (POSTGRES_DB)
# using the unix socket (default) and the file in /docker-entrypoint-initdb.d
psql \
  --username "postgres" \
  --password "postgres123" \
  --dbname   "myappdb" \
  --file     /docker-entrypoint-initdb.d/init.sql \
  --echo-all
