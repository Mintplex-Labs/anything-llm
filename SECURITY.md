# Security Policy

## Supported Versions

The supported versions are the current major version and its two most recent minor releases. Only the latest patch within each supported major/minor is in scope.

## Reporting a Vulnerability

All vulnerability reports must be submitted via [GitHub Security Advisories (GHSA)](https://github.com/Mintplex-Labs/anything-llm/security/advisories/new) — we do not monitor any other reporting platform or accept ad-hoc reports.

For low-severity issues with an obvious fix, you are also welcome to simply open a public PR.

If you are unsure whether something is a security issue or want to check with us before filing, you can email the [Core Mintplex Labs Team](mailto:team@mintplexlabs.com), but the report itself should still go through GHSA unless discussed otherwise.

## Invalid Report Types

Below are some common types of invalid reports that we will not accept and should not be submitted as they will be closed immediately without action.

### SSRF Reports

If you are about to report a SSRF about being able to call web-scraping or document collector against an internal host, [this is not a valid report](https://github.com/Mintplex-Labs/anything-llm/blob/master/collector/utils/url/index.js#L2-L13). This is a feature of the system and is intended to be used in this way given that AnythingLLM is designed to be used in this way so that it can leverage internal services for scraping and collecting content when deployed inside a VPC.

This also applies to any endpoint that accepts a user-configured service URL (e.g., `basePath` for LLM providers like Ollama, LMStudio, or any other third-party service). AnythingLLM is designed to connect to services that administrators configure, including services on internal networks, localhost, or private IPs. An administrator providing a URL to a service they want to connect to is intended functionality, not a vulnerability. These endpoints require admin authentication and expose the same capability already available through the normal settings UI.

### XXS Reports where user must right-click and paste in the URL

If you are about to report a XXS about being able to right-click on an image (like user profile picture) and paste in the URL, this is not a valid report. User profile pictures must be uploaded by the user and cannot be set by the administrator. In fact, nobody can even see them aside from the user themselves. The same goes for any other image that is uploaded by the user or even produced by the system. If the user must right-click and paste in the URL to their browser, this is not a valid report.

Valid XXS Reports must be zero-action - like on loading a page or a image instantly.

### Any "Unauthenticated" actions

If the basis of your report relies on the system not setting up a password or multi-user mode, this is not a valid report. AnythingLLM is designed to be used in this way so that it can be used in trusted and fully isolated environments for single user or internal user. There are three options for authentication:

1. No authentication - this would have no endpoint authentication and would be accessible to anyone who knows the URL.
2. Password - this would require a password to access the system.
3. Multi-user mode - this would require a user to be logged in to the system with username and password and be given explicit access to the system by administrator.

During onboarding, the system will prompt the user to set up a password or multi-user mode. If the user does not opt to set up a password or multi-user mode, the system will be accessible to anyone who knows the URL. This is an intentional design choice and is not a vulnerability.

If your report is about being able to access the system via _bypassing the authentication_ or lackthereof, that **is a valid report** and will be investigated and fixed.

### Reports requiring knowledge or guessing of a UUID

If your report depends on an attacker knowing or guessing a UUID (e.g., a session ID, embed ID, or any other random identifier) without demonstrating a practical way to obtain it, this is not a valid report. UUIDs (v4) have 122 bits of entropy and are not feasible to brute-force. Unless your report includes a concrete method to leak or enumerate the UUID in question, it will be closed immediately.

### Reports based on Developer API Key access

Developer API keys are **system-level credentials**. They are only creatable by administrators and intentionally grant full, unrestricted access to the entire `/v1/*` API surface — equivalent to admin access. If your report's attack chain starts with "attacker has a developer API key," you are describing an attacker who already has admin-equivalent access. There is no privilege escalation possible from a developer API key because it is already the highest privilege level.

This includes reports about API keys being able to mint auth tokens, access admin endpoints, or perform actions on behalf of other users. All of these are intended capabilities of the API key system. If you believe a developer API key should have scoped or limited permissions, that is a feature request, not a vulnerability.

### Reports about admin-enabled agent tools doing "too much"

Several agent tools (e.g., `sql-agent`, filesystem tools) are disabled by default and require an administrator to explicitly enable and configure them. If your report is that an admin-enabled tool can perform actions beyond what you think it should (writes via SQL, broad file access, etc.), this is not a valid report. The admin who enables the tool and configures its access (connection strings, paths, credentials) is making an intentional decision about what the agent can do. We provide UI-level warnings but intentionally do not restrict functionality — the user should be able to do whatever they want with their own systems.

The correct enforcement layer is always the underlying system: use a read-only database account for read-only SQL access, scope filesystem permissions appropriately, etc. Trying to filter or restrict actions at the application layer (regex, allowlists) is trivially bypassable and provides a false sense of security.

### Reports about `GET /api/setup-complete` being public

`/api/setup-complete` is **intentionally unauthenticated**. The frontend calls it before login to decide how to render the app (auth mode, SSO flags, onboarding state, configured providers). Every secret it could touch is returned as a boolean (`true`/`false` for "is this set"), never the value.

What remains — provider names, base URLs, hostnames/ports, storage paths, feature flags — is non-secret configuration. Adding a new field of that kind does not reopen previously fixed CVEs, and "an attacker can learn the stack is Ollama + LanceDB" is not a vulnerability. Reports about this endpoint will only be accepted if it returns an actual secret value (an API key, password, token, or similar credential) in plaintext.

### Reports about `env-dump` endpoints being unauthenticated

**This is the single most frequently filed invalid report we receive. Filing it is a bannable offense.**

`GET /api/env-dump` and `GET /api/v1/system/env-dump` are **intentionally unauthenticated**. They exist so deployment and shutdown scripts can flush the running server's configuration to disk before the process is stopped, so no settings are lost in transit. Those scripts must be able to call it without credentials, which is why it has no auth.

These endpoints take **no input** and return **no data** - the response is an empty `200`. All they do is call `dumpENV()`, which writes the server's *own current in-memory configuration* back to its own `.env` file. The same operation already runs on boot and after every settings change.

There is no attacker-controlled value anywhere in this path. Calling it a thousand times produces the same `.env` file the server would have written anyway. It cannot read, leak, change, inject, or delete any setting. "An unauthenticated user can make the server save its existing config to disk" is not a vulnerability, and pointing at a Swagger `403` annotation does not make it one.

Any GHSA filed about these endpoints will be closed immediately and **the reporter will be blocked from the repository** without further discussion.

## Low-effort and automated reports

Read this document and the relevant code before filing. Reports that fall into any category listed above, that were "verified" only against a reproduction server instead of a running AnythingLLM instance, or that are clearly unreviewed scanner/LLM output will be closed without response.

Repeated submissions of this kind will result in the reporter being blocked from the repository. If you want to do security research on AnythingLLM, the bare minimum is reading the security policy before submitting.
