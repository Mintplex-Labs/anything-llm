const { azureAdEnvironmentConfigured } = require("../../utils/azureAdEnv");

describe("azureAdEnvironmentConfigured", () => {
  const keys = [
    "AZURE_AD_TENANT_ID",
    "AZURE_AD_CLIENT_ID",
    "AZURE_AD_REDIRECT_URI",
    "AZURE_AD_ENABLED",
  ];
  let saved;

  beforeEach(() => {
    saved = {};
    for (const k of keys) {
      saved[k] = process.env[k];
    }
  });

  afterEach(() => {
    for (const k of keys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it("returns false when required vars are missing", () => {
    for (const k of keys) delete process.env[k];
    expect(azureAdEnvironmentConfigured()).toBe(false);
  });

  it("returns true when tenant, client id, and redirect URI are set", () => {
    process.env.AZURE_AD_TENANT_ID = "tenant-guid";
    process.env.AZURE_AD_CLIENT_ID = "client-guid";
    process.env.AZURE_AD_REDIRECT_URI = "http://localhost:3000/";
    delete process.env.AZURE_AD_ENABLED;
    expect(azureAdEnvironmentConfigured()).toBe(true);
  });

  it("returns false when AZURE_AD_ENABLED is false", () => {
    process.env.AZURE_AD_TENANT_ID = "tenant-guid";
    process.env.AZURE_AD_CLIENT_ID = "client-guid";
    process.env.AZURE_AD_REDIRECT_URI = "http://localhost:3000/";
    process.env.AZURE_AD_ENABLED = "false";
    expect(azureAdEnvironmentConfigured()).toBe(false);
  });
});
