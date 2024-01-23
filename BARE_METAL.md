# Run AnythingLLM in production without Docker

> [!WARNING]
> This method of deployment is **not supported** by the core-team and is to be used as a reference for your deployment.
> You are fully responsible for securing your deployment and data in this mode.
> **Any issues** experienced from bare-metal or non-containerized deployments will be **not** answered or supported.

Here you can find the scripts and known working process to run AnythingLLM outside of a Docker container. This method of deployment is preferable for those using local LLMs and want native performance on their devices.

### Minimum Requirements
> [!TIP]
> You should aim for at least 2GB of RAM. Disk storage is proportional to however much data
> you will be storing (documents, vectors, models, etc). Minimum 10GB recommended.

- NodeJS v18
- Yarn


## Getting started

1. Clone the repo into your server as the user who the application will run as.
`git clone git@github.com:Mintplex-Labs/anything-llm.git`

2. `cd anything-llm` and run `yarn setup`. This will install all dependencies to run in production as well as debug the application.

3. `cp server/.env.example server/.env` to create the basic ENV file for where instance settings will be read from on service start. This file is automatically managed and should not be editing manually.

### To start the application

AnythingLLM is comprised of three main sections. The `frontend`, `server`, and `collector`. When running in production you will be running `server` and `collector` on two different processes, with a build step for compilation of the frontend.

1. Build the frontend application.
`cd frontend && yarn build` - this will produce a `frontend/dist` folder that will be used later.

2. Copy `frontend/dist` to `server/public` - `cp -R frontend/dist server/public`.
This should product a folder in `server` named `public` which contains a top level `index.html` and various other files.

_(optional)_ Build native LLM support if using `native` as your LLM.
`cd server && npx --no node-llama-cpp download`

3. Migrate and prepare your database file.
```
cd server && npx prisma generate --schema=./prisma/schema.prisma
cd server && npx prisma migrate deploy --schema=./prisma/schema.prisma
```

4. Boot the server in production
`cd server && NODE_ENV=production index.js &` 

5. Boot the collection in another process
`cd collector && NODE_ENV=production index.js &` 

AnythingLLM should now be running on `http://localhost:3001`!

### Updating AnythingLLM

To update AnythingLLM with future updates you can `git pull origin master` to pull in the latest code and then repeat steps 2 - 5 to deploy with all changes fully.

_note_ You should ensure that each folder runs `yarn` again to ensure packages are up to date in case any dependencies were added, changed, or removed.

_note_ You should `pkill node` before running an update so that you are not running multiple AnythingLLM processes on the same instance as this can cause conflicts.


### Example update script

```shell
#!/bin/bash

cd $HOME/anything-llm &&\
git checkout . &&\
git pull origin master &&\
echo "HEAD pulled to commit $(git log -1 --pretty=format:"%h" | tail -n 1)"

echo "Freezing current ENVs"
curl -I "http://localhost:3001/api/env-dump" | head -n 1|cut -d$' ' -f2

echo "Rebuilding Frontend"
cd $HOME/anything-llm/frontend && yarn && yarn build && cd $HOME/anything-llm

echo "Copying to Sever Public"
rm -rf server/public
cp -r frontend/dist server/public

echo "Killing node processes"
pkill node

echo "Installing collector dependencies"
cd $HOME/anything-llm/collector && yarn

echo "Installing server dependencies & running migrations"
cd $HOME/anything-llm/server && yarn
cd $HOME/anything-llm/server && npx prisma migrate deploy --schema=./prisma/schema.prisma
cd $HOME/anything-llm/server && npx prisma generate

echo "Booting up services."
truncate -s 0 /logs/server.log # Or any other log file location.
truncate -s 0 /logs/collector.log

cd $HOME/anything-llm/server
(NODE_ENV=production node index.js) &> /logs/server.log &

cd $HOME/anything-llm/collector
(NODE_ENV=production node index.js) &> /logs/collector.log &
```


