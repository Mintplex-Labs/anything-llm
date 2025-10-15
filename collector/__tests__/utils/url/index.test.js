const { validURL, validateURL } = require("../../../utils/url");

// Mock the RuntimeSettings module
jest.mock("../../../utils/runtimeSettings", () => {
  const mockInstance = {
    get: jest.fn(),
    set: jest.fn(),
  };
  return jest.fn().mockImplementation(() => mockInstance);
});

describe("validURL", () => {
  let mockRuntimeSettings;

  beforeEach(() => {
    const RuntimeSettings = require("../../../utils/runtimeSettings");
    mockRuntimeSettings = new RuntimeSettings();
    jest.clearAllMocks();
  });

  it("should validate a valid URL", () => {
    mockRuntimeSettings.get.mockImplementation((key) => {
      if (key === "allowAnyIp") return false;
      if (key === "seenAnyIpWarning") return true; // silence the warning for tests
      return false;
    });

    expect(validURL("https://www.google.com")).toBe(true);
    expect(validURL("http://www.google.com")).toBe(true);

    // JS URL does not require extensions, so in theory
    // these should be valid
    expect(validURL("https://random")).toBe(true);
    expect(validURL("http://123")).toBe(true);

    // missing protocols
    expect(validURL("www.google.com")).toBe(false);
    expect(validURL("google.com")).toBe(false);

    // invalid protocols
    expect(validURL("ftp://www.google.com")).toBe(false);
    expect(validURL("mailto://www.google.com")).toBe(false);
    expect(validURL("tel://www.google.com")).toBe(false);
    expect(validURL("data://www.google.com")).toBe(false);
  });

  it("should block private/local IPs when allowAnyIp is false (default behavior)", () => {
    mockRuntimeSettings.get.mockImplementation((key) => {
      if (key === "allowAnyIp") return false;
      if (key === "seenAnyIpWarning") return true; // silence the warning for tests
      return false;
    });

    expect(validURL("http://192.168.1.1")).toBe(false);
    expect(validURL("http://10.0.0.1")).toBe(false);
    expect(validURL("http://172.16.0.1")).toBe(false);

    // But localhost should still be allowed
    expect(validURL("http://127.0.0.1")).toBe(true);
    expect(validURL("http://0.0.0.0")).toBe(true);
  });

  it("should allow any IP when allowAnyIp is true", () => {
    mockRuntimeSettings.get.mockImplementation((key) => {
      if (key === "allowAnyIp") return true;
      if (key === "seenAnyIpWarning") return true; // silence the warning for tests
      return false;
    });

    expect(validURL("http://192.168.1.1")).toBe(true);
    expect(validURL("http://10.0.0.1")).toBe(true);
    expect(validURL("http://172.16.0.1")).toBe(true);
  });
});

describe("validateURL", () => {
  it("should return the same URL if it's already valid", () => {
    expect(validateURL("https://www.google.com")).toBe(
      "https://www.google.com"
    );
    expect(validateURL("http://www.google.com")).toBe("http://www.google.com");
    expect(validateURL("https://random")).toBe("https://random");

    // With numbers as a url this will turn into an ip
    expect(validateURL("123")).toBe("https://0.0.0.123");
    expect(validateURL("123.123.123.123")).toBe("https://123.123.123.123");
    expect(validateURL("http://127.0.123.45")).toBe("http://127.0.123.45");
  });

  it("should assume https:// if the URL doesn't have a protocol", () => {
    expect(validateURL("www.google.com")).toBe("https://www.google.com");
    expect(validateURL("google.com")).toBe("https://google.com");
    expect(validateURL("EXAMPLE.com/ABCDEF/q1=UPPER")).toBe("https://example.com/ABCDEF/q1=UPPER");
    expect(validateURL("ftp://www.google.com")).toBe("ftp://www.google.com");
    expect(validateURL("mailto://www.google.com")).toBe(
      "mailto://www.google.com"
    );
    expect(validateURL("tel://www.google.com")).toBe("tel://www.google.com");
    expect(validateURL("data://www.google.com")).toBe("data://www.google.com");
  });

  it("should remove trailing slashes post-validation", () => {
    expect(validateURL("https://www.google.com/")).toBe(
      "https://www.google.com"
    );
    expect(validateURL("http://www.google.com/")).toBe("http://www.google.com");
    expect(validateURL("https://random/")).toBe("https://random");
    expect(validateURL("https://example.com/ABCDEF/")).toBe("https://example.com/ABCDEF");
  });

  it("should handle edge cases and bad data inputs", () => {
    expect(validateURL({})).toBe("");
    expect(validateURL(null)).toBe("");
    expect(validateURL(undefined)).toBe("");
    expect(validateURL(124512)).toBe("");
    expect(validateURL("")).toBe("");
    expect(validateURL(" ")).toBe("");
    expect(validateURL(" look here! ")).toBe("look here!");
  });

  it("should preserve case of characters in URL pathname", () => {
    expect(validateURL("https://example.com/To/ResOURce?q1=Value&qZ22=UPPE!R"))
      .toBe("https://example.com/To/ResOURce?q1=Value&qZ22=UPPE!R");
    expect(validateURL("https://sample.com/uPeRCaSe"))
      .toBe("https://sample.com/uPeRCaSe");
    expect(validateURL("Example.com/PATH/To/Resource?q2=Value&q1=UPPER"))
      .toBe("https://example.com/PATH/To/Resource?q2=Value&q1=UPPER");
  });
});