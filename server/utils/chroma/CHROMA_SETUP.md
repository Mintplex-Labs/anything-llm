# How to setup a local (or remote) Chroma Vector Database

[Official Chroma Docs](https://docs.trychroma.com/usage-guide#running-chroma-in-clientserver-mode) for reference.

### How to get started

**Requirements**

- Docker
- `git` available in your CLI/terminal

**Instructions**

- `git clone git@github.com:chroma-core/chroma.git` to somewhere on computer.
- `cd chroma`
- `docker-compose up -d --build`
- set the `CHROMA_ENDPOINT=` .env variable in `server` and also set `VECTOR_DB=` to `chroma`.

eg: `server/.env.development`

```
VECTOR_DB="chroma"
CHROMA_ENDPOINT='http://localhost:8000'
```
