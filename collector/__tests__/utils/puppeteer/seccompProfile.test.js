const profile = require("../../../../docker/seccomp-profile.json");

const issueSyscalls = [
  "fanotify_init",
  "mlock",
  "mlockall",
  "setdomainname",
  "sethostname",
  "setns",
  "statx",
  "unshare",
  "vhangup",
];

function unconditionalAllowRule(syscall) {
  return profile.syscalls.find(
    (rule) =>
      rule.names?.includes(syscall) &&
      rule.action === "SCMP_ACT_ALLOW" &&
      (rule.args ?? []).length === 0 &&
      Object.keys(rule.includes ?? {}).length === 0 &&
      Object.keys(rule.excludes ?? {}).length === 0
  );
}

describe("Docker seccomp profile", () => {
  it("keeps an errno default action", () => {
    expect(profile.defaultAction).toBe("SCMP_ACT_ERRNO");
  });

  it.each(issueSyscalls)(
    "allows the issue-reported %s syscall without a capability gate",
    (syscall) => {
      expect(unconditionalAllowRule(syscall)).toBeDefined();
    }
  );

  it("allows Chromium to create its user-namespace sandbox", () => {
    expect(unconditionalAllowRule("clone")).toBeDefined();
  });
});
