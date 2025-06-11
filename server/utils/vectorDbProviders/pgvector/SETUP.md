# Setting up `PGVector` for AnythingLLM

Setting up PGVector for anythingllm to use as your vector database is quite easy. At a minimum, you will need the following:

- PostgreSQL v12+
- [`pgvector`](https://github.com/pgvector/pgvector) extension installed on DB
- User with DB table creation perms and READ access

## Setup on Mac (example)

### Install pgvector extension on PostgreSQL DB

```bash
brew install postgresql
brew services start postgresql
brew install pgvector

# assuming you have a database already set up + a user
psql <database-name>
CREATE EXTENSION vector;
```

### Set PG as your vector db

_this can be done via the UI or by directly editing the `.env` file_

First, obtain a valid connection string for the user, credentials, and db you want to target.
eg: `postgresql://dbuser:dbuserpass@localhost:5432/yourdb`

> [!IMPORTANT]
> If you have an existing table that you want to use as a vector database, AnythingLLM **requires** that the table be
> at least minimally conform to the expected schema - this can be seen in the [index.js](./index.js) file.

_optional_ - set a table name you wish to have AnythingLLM store vectors to. By default this is `anythingllm_vectors`

## Common Questions

### I cannot connect to the DB (Running AnythingLLM in Docker)

If you are running AnythingLLM in Docker, you will need to ensure that the DB is accessible from the container.
If you are running your DB in another Docker container **or** on the host machine, you will need to ensure that the container can access the DB.

`localhost` will not work in this case as it will attempt to connect to the DB _inside the AnythingLLM container_ instead of the host machine or another container.

You will need to use the `host.docker.internal` (or `172.17.0.1` on Linux/Ubuntu) address.

```
on Mac or Windows:
postgresql://dbuser:dbuserpass@localhost:5432/yourdb => postgresql://dbuser:dbuserpass@host.docker.internal:5432/yourdb

on Linux:
postgresql://dbuser:dbuserpass@localhost:5432/yourdb => postgresql://dbuser:dbuserpass@172.17.0.1:5432/yourdb
```

### Can I use an existing table as a vector database?

Yes, you can use an existing table as a vector database. However, AnythingLLM **requires** that the table be at least minimally conform to the expected schema - this can be seen in the [index.js](./index.js) file.

It is **absolutely critical** that the `embedding` column's `VECTOR(XXXX)` dimensions match the dimension of the embedder in AnythingLLM. The default embedding model is 384 dimensions. However, if you are using a custom embedder, you will need to ensure that the dimension value is set correctly.

### Validate the connection to the database

When setting the connection string in or table name via the AnythingLLM UI, the following validations will be attempted:

- Validate the connection string
- Validate the table name
- Run test connection to ensure the table exists and is accessible by the connection string used
- Check if the table name already exists and if so, validate that it is an embedding table with the correct schema

### My embedding table is not present in the DB

The embedding storage table is created by AnythingLLM **on the first upsert** of a vector. If you have not yet embedding any documents, the table will not be present in the DB.

### How do I reset my vector database?

_at the workspace level in Settings > Vector Database_

You can use the "Reset Vector Database" button in the AnythingLLM UI to reset your vector database. This will drop all vectors within that workspace, but the table will remain in the DB.

_reset the vector database at the db level_

For this, you will need to `DROP TABLE` from the command line or however you manage your DB. Once the table is dropped, it will be recreated by AnythingLLM on the next upsert.

## Troubleshooting

### Cannot connect to DB

- Ensure the connection string is valid
- Ensure the user has access to the database
- Ensure the pgvector extension is installed

### Cannot create table

- Ensure the user has `CREATE TABLE` permissions

### Cannot insert vector

- Ensure the user has `INSERT` permissions in the database
- Ensure the table has a dimension value set and this matches the dimension of the embedder in AnythingLLM
- Ensure the table has a vector column set

### Cannot query vector

- Ensure the user has `SELECT` permissions in the database
- Ensure the table has a vector column set
- Ensure the table has a dimension value set and this matches the dimension of the embedder in AnythingLLM

### "type 'vector' does not exist" issues with PGVector

If you are using the PGVector as your vector database, you may encounter an error similar to the following when embedding documents:

```
type 'vector' does not exist
```

This is due to the fact that the `vector` type is not installed on the PG database.

First, follow the instructions in the [PGVector README](https://github.com/pgvector/pgvector#installation) to install the `vector` type on your database.

Then, you will need to create the extension on the database. This can be done by running the following command:

```bash
psql <database-name>
CREATE EXTENSION vector;
```
