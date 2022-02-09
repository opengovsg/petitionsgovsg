# PetitionsGov

## Tech Stack

#### Front-end

- Front-end Framework: `React`
- Styling: `SASS` switching to [Chakra UI](https://chakra-ui.com/)

#### Back-end

- For handling server requests: `Node.js with Express.js Framework`
- Database: `MySQL`

## Prerequisites

[Node, NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

[Git](https://git-scm.com/download/mac)

[Docker](https://docs.docker.com/desktop/mac/install/)

[direnv](https://formulae.brew.sh/formula/direnv#default)

Optionally [VSCode](https://code.visualstudio.com/) with extension `ESLint`

Optionally [DBeaver](https://dbeaver.io/download/) to view database with GUI

## Setup

- Make a copy of `.env.example` and name it `.env`

- [Hook](https://github.com/direnv/direnv/blob/master/docs/hook.md) direnv onto your appropriate shell. Load the environment variables:

  ```
  direnv allow .
  ```

- Install and audit node dependencies

  ```
  npm install

  npm run audit-dep
  ```

- Spin up docker containers (this will create the `petitionsgov` database):

  ```
  docker-compose up
  ```

- Create tables in database:

  ```
  npm run seq-cli db:migrate
  ```

- Seed the database with a sample dataset:

  ```
  npm run seq-cli db:seed:all
  ```

- Optional: Use Dbeaver to connect to the local MySQL server at `127.0.0.1:3306`, using the username and password in `.env`

- Check that your Database ER Diagram looks like this:

![image](https://user-images.githubusercontent.com/56983748/150075819-ba15f7be-28ba-4df9-8119-a8e8182a3e7f.png)

- Stop docker compose (`npm run dev` will spin it up again):

```
docker-compose stop
```

## Running in Development

- Start running frontend, backend, localstack and mysql simultaneously (requires Docker)

  ```
  npm run dev
  ```

  Alternatively, to run individually:

  ```
  # for supporting services
  docker-compose up

  # for backend server only
  npm run build-shared && npm run server

  # for frontend server only
  npm run client
  ```

  Frontend server accessible on `localhost:3000`

  Backend server accessible on `localhost:6174/api/v1`

- Default home page is not authorised. To become authorised user, login via `localhost:3000/login`, and sign in using mockpass while on local development.

## Common Problems

### SQL Related

- Password Auth Error

  Ensure `.env` is correct and check it is sourced by either `direnv` or do

  ```
  source .env
  ```

- Public Key Retrieval Not Allowed

  Change `allowPublicKeyRetrieval=true` on `DBeaver`

- Client does not support authentication protocol requested by server; consider upgrading MySQL client

  Execute the following query in your database GUI

  ```
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
  ```

  Where root as your user, localhost as your URL and password as your password

  Then run this query to refresh privileges:

  ```
  flush privileges;
  ```

  Try connecting using node after you do so.

  If that doesn't work, try it without @'localhost' part.

### Node.js Related

- `Error: error:0308010C:digital envelope routines::unsupported`

  Try using Node.js 16.

## API Endpoints

#### Base Url - `http://localhost:6174/api/v1`

#### Auth

- `GET /auth`
- `GET /auth/sgid/login`
- `GET /auth/callback`

#### Posts

- `GET /posts`
- `GET /posts/:id`
- `GET /posts/basic`
- `POST /posts`
- `DELETE /posts/:id`

#### Signatures

- `GET /posts/signatures/:id`
- `POST /posts/signatures/:id`
- `DELETE /posts/signatures/:id`
