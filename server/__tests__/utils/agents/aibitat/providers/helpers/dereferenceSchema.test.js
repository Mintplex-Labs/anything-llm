const {
  dereferenceSchema,
} = require("../../../../../../utils/agents/aibitat/providers/helpers/dereferenceSchema");

describe("dereferenceSchema", () => {
  it("returns flat schemas structurally unchanged", () => {
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        count: { type: "number", default: 10 },
      },
      required: ["query"],
    };

    expect(dereferenceSchema(schema)).toEqual(schema);
  });

  it("inlines nested $ref/$defs and removes the definition blocks", () => {
    // Shape emitted by an MCP tool backed by a Pydantic v2 nested model (issue #3938).
    const schema = {
      type: "object",
      properties: {
        pagination: { $ref: "#/$defs/PaginationParams" },
        symbol: { type: "string" },
      },
      required: ["pagination"],
      $defs: {
        PaginationParams: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
          },
          required: ["page", "limit"],
        },
      },
    };

    const result = dereferenceSchema(schema);
    expect(result).toEqual({
      type: "object",
      properties: {
        pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
          },
          required: ["page", "limit"],
        },
        symbol: { type: "string" },
      },
      required: ["pagination"],
    });
    expect(result).not.toHaveProperty("$defs");
    expect(JSON.stringify(result)).not.toContain("$ref");
  });

  it("resolves chained references between definitions", () => {
    const schema = {
      type: "object",
      properties: { filter: { $ref: "#/$defs/Filter" } },
      $defs: {
        Filter: {
          type: "object",
          properties: { range: { $ref: "#/$defs/Range" } },
        },
        Range: {
          type: "object",
          properties: { from: { type: "number" }, to: { type: "number" } },
        },
      },
    };

    expect(
      dereferenceSchema(schema).properties.filter.properties.range
    ).toEqual({
      type: "object",
      properties: { from: { type: "number" }, to: { type: "number" } },
    });
  });

  it("supports the `definitions` keyword and inlines references inside arrays", () => {
    const schema = {
      type: "object",
      properties: {
        items: { type: "array", items: { $ref: "#/definitions/Item" } },
      },
      definitions: {
        Item: { type: "object", properties: { id: { type: "string" } } },
      },
    };

    const result = dereferenceSchema(schema);
    expect(result.properties.items.items).toEqual({
      type: "object",
      properties: { id: { type: "string" } },
    });
    expect(result).not.toHaveProperty("definitions");
  });

  it("lets sibling keys of a $ref override the resolved definition", () => {
    const schema = {
      type: "object",
      properties: {
        node: { $ref: "#/$defs/Node", description: "Overridden description" },
      },
      $defs: {
        Node: { type: "object", description: "Original description" },
      },
    };

    expect(dereferenceSchema(schema).properties.node.description).toBe(
      "Overridden description"
    );
  });

  it("collapses self-referencing (recursive) models without looping", () => {
    const schema = {
      type: "object",
      properties: { child: { $ref: "#/$defs/Node" } },
      $defs: {
        Node: {
          type: "object",
          properties: { next: { $ref: "#/$defs/Node" } },
        },
      },
    };

    const result = dereferenceSchema(schema);
    // The first level is inlined; the recursive self-reference collapses to a
    // generic object schema instead of recursing forever.
    expect(result.properties.child.type).toBe("object");
    expect(result.properties.child.properties.next).toEqual({ type: "object" });
  });

  it("drops references that cannot be resolved instead of forwarding a dangling pointer", () => {
    const schema = {
      type: "object",
      properties: { missing: { $ref: "#/$defs/DoesNotExist" } },
    };

    expect(dereferenceSchema(schema).properties.missing).toEqual({});
  });

  it("handles non-object inputs defensively", () => {
    expect(dereferenceSchema(null)).toBeNull();
    expect(dereferenceSchema(undefined)).toEqual({});
    expect(dereferenceSchema("string")).toBe("string");
  });
});
