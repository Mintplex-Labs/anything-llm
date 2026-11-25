/* eslint-env jest */
const { applyEmailEdits } = require("../../../utils/helpers/agents");

describe("applyEmailEdits", () => {
  const fields = {
    to: "a@example.com",
    subject: "Hello",
    body: "Plain body",
    cc: "c@example.com",
    bcc: undefined,
    htmlBody: "<p>Plain body</p>",
  };

  it("returns the original fields when there are no edits", () => {
    expect(applyEmailEdits(fields)).toBe(fields);
    expect(applyEmailEdits(fields, null)).toBe(fields);
    expect(applyEmailEdits(fields, "nope")).toBe(fields);
    expect(applyEmailEdits(fields, ["to"])).toBe(fields);
  });

  it("applies trimmed string edits for the editable fields only", () => {
    const merged = applyEmailEdits(fields, {
      to: "  b@example.com, d@example.com ",
      cc: "",
      subject: "Updated",
      attachments: ["/etc/passwd"],
      replyTo: "evil@example.com",
    });
    expect(merged).toEqual({
      ...fields,
      to: "b@example.com, d@example.com",
      cc: "",
      subject: "Updated",
    });
    expect(merged.attachments).toBeUndefined();
    expect(merged.replyTo).toBeUndefined();
  });

  it("ignores edits that are not strings", () => {
    const merged = applyEmailEdits(fields, { to: 5, subject: null, body: {} });
    expect(merged).toEqual(fields);
  });

  it("drops the html body once the plain body has been rewritten", () => {
    const merged = applyEmailEdits(fields, { body: "New body" });
    expect(merged.body).toBe("New body");
    expect(merged.htmlBody).toBeUndefined();
  });

  it("does not mutate the original fields", () => {
    applyEmailEdits(fields, { subject: "Changed" });
    expect(fields.subject).toBe("Hello");
  });
});
