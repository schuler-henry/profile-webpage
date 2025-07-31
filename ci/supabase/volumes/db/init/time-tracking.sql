\set pguser `echo "$POSTGRES_USER"`

create schema if not exists "time-tracking";
alter schema "time-tracking" owner to :pguser;

create table if not exists "time-tracking"."Project" (
   id uuid not null default gen_random_uuid (),
   name text not null default ''::text,
   description text not null default ''::text,
   owner uuid not null,
   "createdAt" timestamp with time zone not null default now(),
   constraint Projects_pkey primary key (id),
   constraint Projects_owner_fkey foreign KEY (owner) references auth.users (id) on update CASCADE
) TABLESPACE pg_default;

create table if not exists "time-tracking"."TimeEntry" (
    id uuid not null default gen_random_uuid (),
    "startTime" time without time zone not null default now(),
    "endTime" time without time zone null,
    description text not null default ''::text,
    project uuid not null,
    date date not null default now(),
    constraint TimeEntry_pkey primary key (id),
    constraint TimeEntry_project_fkey foreign KEY (project) references "time-tracking"."Project" (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

GRANT USAGE ON SCHEMA "time-tracking" TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA "time-tracking" TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA "time-tracking" TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA "time-tracking" TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA "time-tracking" GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA "time-tracking" GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA "time-tracking" GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

INSERT INTO "time-tracking"."Project" ("id", "name", "description", "owner", "createdAt") VALUES
    ('fb491449-5745-4ea2-b6d6-fc44b6a671a8', 'Project 1', 'Description for Project 1', 'c2f0449a-a510-47be-885d-58c18662cdea', '2024-10-26 23:10:19.227+00');

INSERT INTO "time-tracking"."TimeEntry" ("id", "startTime", "endTime", "description", "project", "date") VALUES
    ('07aa03f0-d7fe-4eb7-a45b-320de25a1cf9', '11:53:43', '14:20:13', 'Admin-Tool: Completed integration of E2E tests in CI.', 'fb491449-5745-4ea2-b6d6-fc44b6a671a8', '2025-03-19');