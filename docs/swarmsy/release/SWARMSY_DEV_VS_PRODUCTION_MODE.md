# SWARMSY Dev vs Production Mode

## Developer Mode (contributors only)

Developer mode is for people building or modifying the repository.

Typical contributor workflow:

- `git pull`
- `yarn setup`
- `yarn dev:server`
- `yarn dev:collector`
- `yarn dev:frontend`

This mode is not intended for normal end users.

## Production / Finished Product Mode (real users)

Production mode is the intended finished-product path for normal users.

Normal user workflow:

1. Open hosted URL
2. Log in
3. Use app

Normal users should never need developer-mode commands.

## Self-host Mode (technical operators)

Self-host mode is for technical operators responsible for deployment and operations.

- Deploy and run SWARMSY on Docker and/or server infrastructure
- Configure runtime services, data, providers, and deployment settings
- Keep hosted app available for user access

## Mode boundary summary

- Developer mode: contributors only
- Production mode: real users
- Self-host mode: technical operators/admins

Normal users should never need developer mode.
