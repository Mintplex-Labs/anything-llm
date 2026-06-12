/**
 * Inlines all local JSON-Schema `$ref` pointers (those referencing `$defs`/`definitions`)
 * and removes the definition blocks from the resulting schema.
 *
 * Some MCP servers - notably tools defined with Pydantic v2 nested models - expose an
 * `inputSchema` that describes nested object parameters via `$ref`/`$defs`. Providers that
 * do not resolve local references on their end (e.g. Anthropic's `input_schema`) will fail
 * the tool call - and the entire agent session - when handed a dangling `$ref`. Inlining
 * the references produces an equivalent, self-contained schema that every provider can read.
 *
 * Flat schemas (no `$ref`/`$defs`) are returned structurally unchanged.
 *
 * @param {Object} schema - A JSON-schema-like object (typically a tool's `parameters`).
 * @returns {Object} A new schema with all local `$ref`s inlined and `$defs`/`definitions`
 * removed. Self-referencing (recursive) models are collapsed to a generic object schema to
 * avoid infinite recursion, and references that cannot be resolved are dropped rather than
 * forwarded as dangling pointers.
 */
function dereferenceSchema(schema = {}) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema))
    return schema;

  const definitions = {
    ...(schema.$defs || {}),
    ...(schema.definitions || {}),
  };

  const resolveRef = (ref) => {
    if (typeof ref !== "string") return null;
    const match = /^#\/(?:\$defs|definitions)\/(.+)$/.exec(ref);
    if (!match) return null;
    return definitions[match[1]] ?? null;
  };

  const walk = (node, seenRefs) => {
    if (Array.isArray(node)) return node.map((item) => walk(item, seenRefs));
    if (!node || typeof node !== "object") return node;

    if (typeof node.$ref === "string") {
      const { $ref, ...siblings } = node;
      const resolved = resolveRef($ref);

      // Drop references we cannot resolve so we never forward a dangling pointer.
      if (!resolved) return walk(siblings, seenRefs);

      // Collapse recursive models so we do not loop forever inlining themselves.
      if (seenRefs.has($ref))
        return { type: "object", ...walk(siblings, seenRefs) };

      // Siblings of a `$ref` (e.g. an overriding `description`) take precedence per spec.
      return walk({ ...resolved, ...siblings }, new Set([...seenRefs, $ref]));
    }

    const output = {};
    for (const [key, value] of Object.entries(node)) {
      if (key === "$defs" || key === "definitions") continue;
      output[key] = walk(value, seenRefs);
    }
    return output;
  };

  return walk(schema, new Set());
}

module.exports = { dereferenceSchema };
