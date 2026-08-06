# Security Policy

## Supported Versions

The supported versions are the current major version and its two most recent minor releases. Only the latest patch within each supported major/minor is in scope.

## Reporting a Vulnerability

If a security concern is found that you would like to disclose you can create a PR for it or if you would like to clear this issue before posting you can email [Core Mintplex Labs Team](mailto:team@mintplexlabs.com).

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

### Reports about admin-enabled agent tools doing "too much"

Several agent tools (e.g., `sql-agent`, filesystem tools) are disabled by default and require an administrator to explicitly enable and configure them. If your report is that an admin-enabled tool can perform actions beyond what you think it should (writes via SQL, broad file access, etc.), this is not a valid report. The admin who enables the tool and configures its access (connection strings, paths, credentials) is making an intentional decision about what the agent can do. We provide UI-level warnings but intentionally do not restrict functionality — the user should be able to do whatever they want with their own systems.

The correct enforcement layer is always the underlying system: use a read-only database account for read-only SQL access, scope filesystem permissions appropriately, etc. Trying to filter or restrict actions at the application layer (regex, allowlists) is trivially bypassable and provides a false sense of security.
