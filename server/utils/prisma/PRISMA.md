# Prisma Setup and Usage Guide

This guide will help you set up and use Prisma for the project. Prisma is a powerful ORM for Node.js and TypeScript, helping developers build faster and make fewer errors. Follow the guide to understand how to use Prisma and the scripts available in the project to manage the Prisma setup.

## Setting Up Prisma

To get started with setting up Prisma, you should run the setup script from the project root directory:

```sh
yarn setup
```

This script will install the necessary node modules in both the server and frontend directories, set up the environment files, and set up Prisma (generate client, run migrations, and seed the database).

## Prisma Scripts

In the project root's `package.json`, there are several scripts set up to help you manage Prisma:

- **prisma:generate**: Generates the Prisma client.
- **prisma:migrate**: Runs the migrations to ensure the database is in sync with the schema.
- **prisma:seed**: Seeds the database with initial data.
- **prisma:setup**: A convenience script that runs `prisma:generate`, `prisma:migrate`, and `prisma:seed` in sequence.
- **sqlite:migrate**: (To be run from the `server` directory) This script is for users transitioning from the old SQLite custom ORM setup to Prisma and will migrate all exisiting data over to Prisma. If you're a new user, your setup will already use Prisma.

To run any of these scripts, use `yarn` followed by the script name from the project root directory. For example:

```sh
yarn prisma:setup
```

## Manual Prisma Commands

While the scripts should cover most of your needs, you may sometimes want to run Prisma commands manually. Here are some commands you might find useful, along with their descriptions:

- `npx prisma introspect`: Introspects the database to update the Prisma schema by reading the schema of the existing database.
- `npx prisma generate`: Generates the Prisma client.
- `npx prisma migrate dev --name init`: Ensures the database is in sync with the schema, naming the migration 'init'.
- `npx prisma migrate reset`: Resets the database, deleting all data and recreating the schema.

These commands should be run from the `server` directory, where the Prisma schema is located.

## Notes

- Always make sure to run scripts from the root level to avoid path issues.
- Before running migrations, ensure that the Prisma schema is correctly defined to prevent data loss or corruption.
- If you are adding a new feature or making changes that require a change in the database schema, create a new migration rather than editing existing migrations.
- For users transitioning from the old SQLite ORM, navigate to the `server` directory and run the `sqlite:migrate` script to smoothly transition to Prisma. If you're setting up the project fresh, this step is unnecessary as the setup will already be using Prisma.
