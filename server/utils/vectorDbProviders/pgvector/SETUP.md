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

> ![NOTE]
> If you have an existing table that you want to use as a vector database, AnythingLLM **requires** that the table be
> at least minimally conform to the expected schema - this can be seen in the [index.js](./index.js) file.

_optional_ - set a table name you wish to have AnythingLLM store vectors to. By default this is `anythingllm_vectors`

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
