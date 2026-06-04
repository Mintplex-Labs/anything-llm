const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const signingSchemaPath = path.join(
  repoRoot,
  "desktop/signing/signingConfigSchema.cjs"
);
const signingEnvironmentPath = path.join(
  repoRoot,
  "desktop/signing/signingEnvironment.cjs"
);
const signingWorkflowPath = path.join(
  repoRoot,
  "desktop/signing/signingWorkflowHelpers.cjs"
);
const artifactWorkflowPath = path.join(
  repoRoot,
  ".github/workflows/desktop-artifact-build.yml"
);
const installerWorkflowPath = path.join(
  repoRoot,
  ".github/workflows/desktop-installer-build.yml"
);

const { SIGNING_ENV, SIGNING_STATUSES, signingConfigSchema } = require(signingSchemaPath);
const { validateSigningEnvironment } = require(signingEnvironmentPath);
const { resolveSigningStatus } = require(signingWorkflowPath);

describe("desktop code signing foundation", () => {
  it("defines a no-secret signing configuration schema", () => {
    expect(signingConfigSchema.statuses).toEqual([
      SIGNING_STATUSES.SIGNED,
      SIGNING_STATUSES.UNSIGNED,
      SIGNING_STATUSES.SIGNING_UNAVAILABLE,
    ]);
    expect(signingConfigSchema.secretEnvironmentVariables).toEqual([
      SIGNING_ENV.CERT_PASSWORD,
    ]);
    expect(signingConfigSchema.allowedCertificateExtensions).toEqual([
      ".pfx",
      ".p12",
    ]);
  });

  it("handles a missing certificate without failing eligibility detection", () => {
    const result = validateSigningEnvironment({ env: {} });

    expect(result).toEqual(
      expect.objectContaining({
        status: SIGNING_STATUSES.SIGNING_UNAVAILABLE,
        certificateAvailable: false,
        reason: "certificate_missing",
      })
    );
    expect(result.safeDetails.join(" ")).not.toMatch(/password|secret/i);
  });

  it("handles invalid certificate configuration without exposing secrets", () => {
    const result = validateSigningEnvironment({
      env: {
        [SIGNING_ENV.CERT_PATH]: "/tmp/not-a-certificate.txt",
        [SIGNING_ENV.CERT_PASSWORD]: "placeholder-value",
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        status: SIGNING_STATUSES.SIGNING_UNAVAILABLE,
        certificateAvailable: false,
        certificatePathConfigured: true,
        reason: "invalid_certificate_configuration",
      })
    );
    expect(JSON.stringify(result)).not.toContain("placeholder-value");
  });

  it("reports unsigned when a future certificate is available but signing is not performed", () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "swarmsy-signing-"));
    const certPath = path.join(tmpRoot, "future-test-only.pfx");
    fs.writeFileSync(certPath, "placeholder cert bytes");

    try {
      const result = validateSigningEnvironment({
        env: {
          [SIGNING_ENV.CERT_PATH]: certPath,
          [SIGNING_ENV.CERT_PASSWORD]: "placeholder-value",
        },
      });

      expect(result).toEqual(
        expect.objectContaining({
          status: SIGNING_STATUSES.UNSIGNED,
          certificateAvailable: true,
          reason: "certificate_available_signing_not_performed",
        })
      );
      expect(JSON.stringify(result)).not.toContain("placeholder-value");
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it("can represent a signed result from a future external signing step", () => {
    expect(resolveSigningStatus({ signed: true })).toEqual(
      expect.objectContaining({
        status: SIGNING_STATUSES.SIGNED,
        reason: "artifact_signed",
      })
    );
  });

  it("integrates signing readiness without requiring certificates in desktop workflows", () => {
    const artifactWorkflow = fs.readFileSync(artifactWorkflowPath, "utf8");
    const installerWorkflow = fs.readFileSync(installerWorkflowPath, "utf8");

    expect(artifactWorkflow).toContain("npm run desktop:signing:check");
    expect(installerWorkflow).toContain("npm run desktop:release:manifest");
    expect(installerWorkflow).toContain("npm run desktop:release:validate");
    expect(installerWorkflow).toContain(
      "server/__tests__/desktop/desktopSigningFoundation.test.js server/__tests__/desktop/desktopReleaseIntegrity.test.js"
    );
  });
});
