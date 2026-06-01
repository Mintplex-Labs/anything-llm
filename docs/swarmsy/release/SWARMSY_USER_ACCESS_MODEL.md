# SWARMSY User Access Model

## Intended normal user flow

1. Open the hosted SWARMSY URL (for example, `https://your-domain.com`).
2. Log in or create an account (based on deployment authentication settings).
3. Complete SWARMSY onboarding.
4. Create a SWARMSY HIVE.
5. Load the required doctrine docs.
6. Start intake, continue from memory lock, run campaign flow, or run proof review flow.

## User experience boundary

Normal users should only need a browser and account access.

Users do **not** need to:

- Use Git
- Use CMD/terminal commands
- Use Docker
- Install Node.js or Yarn
- Manually run server/frontend/collector processes

## Deployment-auth dependent login behavior

Login and account creation behavior may vary by deployment setup:

- Some deployments allow self-signup.
- Some deployments use invite-only or admin-controlled accounts.
- Some deployments use SSO or external identity providers.

Regardless of auth method, the normal user path remains: open URL, authenticate, and use SWARMSY HIVE + SPARKY.
