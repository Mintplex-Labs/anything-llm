# How to setup OpenGauss Vector Database for AnythingLLM

[Official OpenGauss Docs](https://docs.opengauss.org/zh/) for reference.

### How to get started

**Requirements**

- Docker
  - `git` available in your CLI/terminal

**Instructions**

- (https://docs.opengauss.org/zh/docs/latest/docs/InstallationGuide/%E5%AE%B9%E5%99%A8%E9%95%9C%E5%83%8F%E5%AE%89%E8%A3%85.html) for reference.

eg: `server/.env.development`

```
VECTOR_DB="openGauss"
OPENGAUSS_HOST="127.0.0.1"
OPENGAUSS_PORT=5432
OPENGAUSS_USERNAME=
OPENGAUSS_PASSWORD=
OPENGAUSS_DATABASE="postgres"
```
