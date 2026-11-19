-- Convert single scope values into JSON arrays of scopes. Full access is stored as NULL.
UPDATE "api_keys" SET "scope" = NULL, "scopeConfig" = NULL WHERE "scope" = 'full';
UPDATE "api_keys" SET "scope" = '["chat","workspace","openai"]' WHERE "scope" = 'workspace';
UPDATE "api_keys" SET "scope" = '["users","sso"]' WHERE "scope" = 'user';
