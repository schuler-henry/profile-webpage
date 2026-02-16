# Supabase Docker

This directory contains all required files to run a test Supabase instance using Docker.

## Setup

The `.env.example` file contains the environment variables required to run the Supabase instance.
By executing the `reset.sh` script, the local database will be cleared and the `.env` file will be created from the
`.env.example` file.
Make sure to execute the script in the directory where the script is located using admin privileges (otherwise the
script will not be able to clear the database):

```bash
sudo ./reset.sh
```

## How to Run

The `docker-compose.yml` file is used to start the Supabase instance using Docker Compose.
It uses the environment variables defined in the `.env` file.

A minimal Supabase instance is started using the following command:

```bash
docker compose up kong rest -d
```

This will start all required services for the integrated tests to connect to the Supabase database through the Supabase
REST API.

Alternatively, all services can be started using the following command:

```bash
docker compose up -d
```

## Custom Database Initialization

If and only if the database does not exist when starting the Supabase instance (e.g. after running the `reset.sh`
script), the database will run initialization scripts.
In order to add custom initialization scripts to provide custom schemas, tables and data, follow these steps:

1. Create a new .sql file in the `./volumes/db/init` directory.
2. Add the .sql file to the `docker-compose.yml` file under the `volumes` section of the `db` service like so (replace
   `your_custom_script.sql` with the name of your script):
   ```yaml
    volumes:
      - ./volumes/db/init/your_custom_script.sql:/docker-entrypoint-initdb.d/init-scripts/your_custom_script.sql:Z
   ```

> As can be seen in [`./volumes/db/init/time-tracking.sql`](./volumes/db/init/time-tracking.sql), make sure to grant
> access to the created schema and tables, otherwise the Supabase REST API will not be able to access them (replace
`your-schema` with the name of your schema):
> ```sql
> GRANT USAGE ON SCHEMA your-schema TO anon, authenticated, service_role;
> GRANT ALL ON ALL TABLES IN SCHEMA your-schema TO anon, authenticated, service_role;
> GRANT ALL ON ALL ROUTINES IN SCHEMA your-schema TO anon, authenticated, service_role;
> GRANT ALL ON ALL SEQUENCES IN SCHEMA your-schema TO anon, authenticated, service_role;
> ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA your-schema GRANT ALL ON TABLES TO anon, authenticated, service_role;
> ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA your-schema GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
> ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA your-schema GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
> ```