const fs = require("fs");
const os = require("os");
const path = require("path");
const loadCACertificates = require("../../../utils/boot/loadCACertificates");

// Public test CA certificates (no private keys), generated for these tests.
const CERT_A = `-----BEGIN CERTIFICATE-----
MIIDFzCCAf+gAwIBAgIUdN3BIo+97QGIbI5WHnCmUiTw9CUwDQYJKoZIhvcNAQEL
BQAwGzEZMBcGA1UEAwwQVGVzdCBJbnRlcm5hbCBDQTAeFw0yNjExMDUxNzQ0MzFa
Fw0zNjExMDIxNzQ0MzFaMBsxGTAXBgNVBAMMEFRlc3QgSW50ZXJuYWwgQ0EwggEi
MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCbH0yyfd+0kpeZ4FtlOI2c+xUG
/2sNk2Tzrlk+c/CmCBZ9G+CgPYt8ZYCRZ1sux8QrapOupShJ3BOGFfvUjXE3r25E
SOKZ/p1L+IEBntvt+Anm1/LVWSdeutfUVJ9OYJXeGcmzUuolEUlIb6Ad/tbg2GZY
WdXQBnEARhFrFnEbTdwp03y3DgQDRYPV+WRqI4GfGZkgOvrW5Wf4NcCAogvbw4Ri
FwGWdC+G9fKNLuEVxQLUH25rUh0I3QnzZj5HLENxOCL1SGTBCNZZxZWn7t7QoIfL
5cGHCFecmzj5HXYcxci2Xp4ZN7pz7RFOKwgyTYjp3krJqqi0O+TyAmGoLeLXAgMB
AAGjUzBRMB0GA1UdDgQWBBTl3qO8Tk75q2CwH2tq1RpVwTpgGTAfBgNVHSMEGDAW
gBTl3qO8Tk75q2CwH2tq1RpVwTpgGTAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3
DQEBCwUAA4IBAQALtI6Kpx9Twp1M8UFxQFNZN/71XgJb7Gpj6ICbDTpcS0R3MUh1
KaTDCfpUiw3JIzKkMCD9uDBYjttEfpf6KvM4oMG9df+Yni4d2GAtapIlcoH0fnYj
X5FcOP7/wC8G33KCpI/MTxJ41gCJcdmI4ZwiKG98O8lNbQ+VsGwvPs2LqEFrOxUZ
LUI1tERrgO8WSl8gjbrCAwUkyR2COE8u+JEQBmo+qMLcKWiYXCKYZ4jBEARgGOJs
a6YgHtrnEL3xCX6R/szkKnVVSQhZIIxjHeM0pbUrakz6S6Bb0lhjJ6ztOsNWfHT+
ybTr1TYTTDyTrvuW3RXU2xMIuGvnLD5S287q
-----END CERTIFICATE-----`;

const CERT_B = `-----BEGIN CERTIFICATE-----
MIIDIzCCAgugAwIBAgIUBoEe7O0ikAINsKPRxDVH+COGOkgwDQYJKoZIhvcNAQEL
BQAwITEfMB0GA1UEAwwWVGVzdCBDb3Jwb3JhdGUgUm9vdCBDQTAeFw0yNjExMDUx
NzQ1MzNaFw0zNjExMDIxNzQ1MzNaMCExHzAdBgNVBAMMFlRlc3QgQ29ycG9yYXRl
IFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDULBpT9l1j
QbSBbwfv1S1lJ1XsR16yJV3wuN/gNrNktJczJzL4HiCxuTGGyG4zx67QXQr4D6Ih
SgO49zeTNQSp1URJ7ZW0Mp0LOwBUZPhMfXE4n6GlQIabgVbc8bg76w6Au3Zdoy7b
apxanGYMhpNg7gP0qKkMuxs5LssdKRkVGAMnx9g1MiBYjl/60EDYn181QVqjNU7e
Y12H13Q2vZf2L+hErMLavvIXfYYlumJ+zJjOa6tYDFdmj2g7wGibb47eMJLc/Fxf
frHI/Vsygv0Co9J8KCZi2pgYwP+e06uIvWrJNMialE8BpYitVfxnLXcmYJOyvCzy
GBXBG9pqe0CDAgMBAAGjUzBRMB0GA1UdDgQWBBTC4keC1fvnYuEKvb9I0TSfiX9R
iTAfBgNVHSMEGDAWgBTC4keC1fvnYuEKvb9I0TSfiX9RiTAPBgNVHRMBAf8EBTAD
AQH/MA0GCSqGSIb3DQEBCwUAA4IBAQBWoYFBhlIa00r/zFjNb1QZ2eVpSVq2uCit
4GhqRyKFpa0Ylj12kOoPhr8L1NJzrkd0t7B1w5NMVK8+WLdVaT2/EtkH3/SOE+b7
197xUJjOgHnweHa6QA6MVExD8B8DhV0RZI0ncfGCDCi5vXP+Pub/rYa5pjBXBju+
h0cwRfdDK+X8hUoB6tM8JEHNmp9uHqobnO2h+L6bkI1TgD4LJY2K8QsUpk+BvRJi
XHXydKoJXWyZH4SGmWdSnaNp2EJYf06Ch3uN0W0VoU4kHjxX9KqitwAHgmHA2ibc
rvYAN0MEGdwGYfKMFLjvA3vwiE7QrtGrXt+V29jfdVQm/te0geIS
-----END CERTIFICATE-----`;

const BUNDLED = "bundled-root-pem";
const NOT_A_CERT = `-----BEGIN CERTIFICATE-----
bm90IGEgY2VydGlmaWNhdGU=
-----END CERTIFICATE-----`;

function fakeTls({ system = [] } = {}) {
  return {
    getCACertificates: jest.fn((type) =>
      type === "system" ? system : [BUNDLED]
    ),
    setDefaultCACertificates: jest.fn(),
  };
}

describe("loadCACertificates", () => {
  let tmpDir;
  let warn;
  let log;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "anythingllm-ca-"));
    warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    log = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    log.mockRestore();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function writeBundle(content) {
    const file = path.join(tmpDir, "bundle.pem");
    fs.writeFileSync(file, content);
    return file;
  }

  it("does nothing when neither setting is set", () => {
    const tlsModule = fakeTls();
    const result = loadCACertificates({ env: {}, tlsModule });
    expect(result).toEqual({ applied: false, system: 0, extra: 0 });
    expect(tlsModule.getCACertificates).not.toHaveBeenCalled();
    expect(tlsModule.setDefaultCACertificates).not.toHaveBeenCalled();
  });

  it.each(["1", "true", "TRUE", " yes ", "on"])(
    "treats ANYTHINGLLM_USE_SYSTEM_CA=%j as enabled",
    (value) => {
      const tlsModule = fakeTls({ system: [CERT_A] });
      const result = loadCACertificates({
        env: { ANYTHINGLLM_USE_SYSTEM_CA: value },
        tlsModule,
      });
      expect(result.applied).toBe(true);
      expect(tlsModule.setDefaultCACertificates).toHaveBeenCalledWith([
        BUNDLED,
        CERT_A,
      ]);
    }
  );

  it.each(["", "0", "false", "no", "off", "maybe"])(
    "treats ANYTHINGLLM_USE_SYSTEM_CA=%j as disabled",
    (value) => {
      const tlsModule = fakeTls({ system: [CERT_A] });
      const result = loadCACertificates({
        env: { ANYTHINGLLM_USE_SYSTEM_CA: value },
        tlsModule,
      });
      expect(result.applied).toBe(false);
      expect(tlsModule.setDefaultCACertificates).not.toHaveBeenCalled();
    }
  );

  it("adds the operating system certificates to the defaults without duplicates", () => {
    const tlsModule = fakeTls({ system: [BUNDLED, CERT_A, CERT_A, CERT_B] });
    const result = loadCACertificates({
      env: { ANYTHINGLLM_USE_SYSTEM_CA: "true" },
      tlsModule,
    });
    expect(result).toEqual({ applied: true, system: 2, extra: 0 });
    expect(tlsModule.setDefaultCACertificates).toHaveBeenCalledWith([
      BUNDLED,
      CERT_A,
      CERT_B,
    ]);
  });

  it("does not call setDefaultCACertificates when the system store adds nothing", () => {
    const tlsModule = fakeTls({ system: [BUNDLED] });
    const result = loadCACertificates({
      env: { ANYTHINGLLM_USE_SYSTEM_CA: "true" },
      tlsModule,
    });
    expect(result.applied).toBe(false);
    expect(tlsModule.setDefaultCACertificates).not.toHaveBeenCalled();
  });

  it("adds every certificate in ANYTHINGLLM_EXTRA_CA_CERTS", () => {
    const tlsModule = fakeTls();
    const file = writeBundle(`# corporate roots\n${CERT_A}\n\n${CERT_B}\n`);
    const result = loadCACertificates({
      env: { ANYTHINGLLM_EXTRA_CA_CERTS: file },
      tlsModule,
    });
    expect(result).toEqual({ applied: true, system: 0, extra: 2 });
    expect(tlsModule.setDefaultCACertificates).toHaveBeenCalledWith([
      BUNDLED,
      CERT_A,
      CERT_B,
    ]);
  });

  it("combines the system store and the extra bundle", () => {
    const tlsModule = fakeTls({ system: [CERT_A] });
    const file = writeBundle(`${CERT_A}\n${CERT_B}`);
    const result = loadCACertificates({
      env: { ANYTHINGLLM_USE_SYSTEM_CA: "1", ANYTHINGLLM_EXTRA_CA_CERTS: file },
      tlsModule,
    });
    expect(result).toEqual({ applied: true, system: 1, extra: 1 });
    expect(tlsModule.setDefaultCACertificates).toHaveBeenCalledWith([
      BUNDLED,
      CERT_A,
      CERT_B,
    ]);
  });

  it("skips invalid certificates in the bundle and keeps the valid ones", () => {
    const tlsModule = fakeTls();
    const file = writeBundle(`${NOT_A_CERT}\n${CERT_B}`);
    const result = loadCACertificates({
      env: { ANYTHINGLLM_EXTRA_CA_CERTS: file },
      tlsModule,
    });
    expect(result).toEqual({ applied: true, system: 0, extra: 1 });
    expect(tlsModule.setDefaultCACertificates).toHaveBeenCalledWith([
      BUNDLED,
      CERT_B,
    ]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Skipped 1 invalid certificate(s)")
    );
  });

  it("warns and keeps the defaults when the bundle has no valid certificate", () => {
    const tlsModule = fakeTls();
    const file = writeBundle("this is not a PEM file");
    const result = loadCACertificates({
      env: { ANYTHINGLLM_EXTRA_CA_CERTS: file },
      tlsModule,
    });
    expect(result.applied).toBe(false);
    expect(tlsModule.setDefaultCACertificates).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("No valid PEM certificates")
    );
  });

  it("warns instead of throwing when the bundle file does not exist", () => {
    const tlsModule = fakeTls();
    const result = loadCACertificates({
      env: { ANYTHINGLLM_EXTRA_CA_CERTS: path.join(tmpDir, "missing.pem") },
      tlsModule,
    });
    expect(result.applied).toBe(false);
    expect(tlsModule.setDefaultCACertificates).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Could not read ANYTHINGLLM_EXTRA_CA_CERTS")
    );
  });

  it("still applies the system store when the bundle file is missing", () => {
    const tlsModule = fakeTls({ system: [CERT_A] });
    const result = loadCACertificates({
      env: {
        ANYTHINGLLM_USE_SYSTEM_CA: "true",
        ANYTHINGLLM_EXTRA_CA_CERTS: path.join(tmpDir, "missing.pem"),
      },
      tlsModule,
    });
    expect(result).toEqual({ applied: true, system: 1, extra: 0 });
  });

  it("warns on a Node.js version without the CA certificate API", () => {
    const result = loadCACertificates({
      env: { ANYTHINGLLM_USE_SYSTEM_CA: "true" },
      tlsModule: {},
    });
    expect(result.applied).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Node.js 22.19+")
    );
  });

  it("does not throw when Node rejects the certificates", () => {
    const tlsModule = fakeTls({ system: [CERT_A] });
    tlsModule.setDefaultCACertificates.mockImplementation(() => {
      throw new Error("ERR_CRYPTO_OPERATION_FAILED");
    });
    const result = loadCACertificates({
      env: { ANYTHINGLLM_USE_SYSTEM_CA: "true" },
      tlsModule,
    });
    expect(result).toEqual({ applied: false, system: 0, extra: 0 });
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Could not load custom CA certificates")
    );
  });
});
