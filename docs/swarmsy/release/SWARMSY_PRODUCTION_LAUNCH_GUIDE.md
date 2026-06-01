# SWARMSY Production Launch Guide

## Production goal

The current SWARMSY product is meant to be used as a hosted web app for real users.

The production user path is:

1. SWARMSY is deployed once by an operator.
2. Users open the hosted URL.
3. Users log in.
4. Users use SWARMSY HIVE and SPARKY.

Example hosted URL:

- `https://your-domain.com`

## Hosted app model

SWARMSY production mode is a hosted application model, not a developer repo workflow.

- Operators/admins deploy and maintain the service.
- Normal users only use the web app in a browser.
- Developer mode is for contributors only.

## What runs on the server

In production, runtime services are managed on the host environment by the operator.

This includes:

- Web application runtime
- API/backend runtime
- Database and storage connections
- Model provider and embedding configuration
- Document collector/processing services used by the deployment

## What the user sees

Normal users should only see and use:

- Hosted SWARMSY login and app pages
- SWARMSY onboarding flow
- SWARMSY HIVE workspace experience
- SPARKY-guided intake, continuation, campaign, and proof workflows

## What the admin/operator manages

Admin/operator responsibilities include:

- Hosting, domain, TLS, and uptime
- Environment configuration
- Database/storage configuration
- Model and embedding provider configuration
- Document ingestion/collector readiness
- Deployment updates, monitoring, and backup/recovery practices

## What is not user-facing

The following are not part of the normal user experience:

- Running Git commands
- Running terminal/CMD commands
- Running `yarn dev` scripts
- Running multiple local terminals for server/frontend/collector
- Local Docker or Node/Yarn setup on end-user machines

## Mode clarity

- **Developer mode** is for contributors only.
- **Production mode** is what users use.
- Normal users should access SWARMSY through a hosted URL, log in, and use the app.
