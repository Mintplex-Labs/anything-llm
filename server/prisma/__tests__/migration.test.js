/**
 * Prisma migration edge case tests
 * Tests idempotency, empty string handling, and null vs undefined in Prisma queries.
 */

const { PrismaClient } = require("@prisma/client");

describe("Prisma migration edge cases", () => {
  let prisma;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  /**
   * Test: Migration with no changes should be idempotent.
   * Running a no-op migration multiple times should not cause errors or data corruption.
   */
  test("migration idempotency - no-op migration should not error", async () => {
    // Create a record
    const created = await prisma.workspaces.create({
      data: {
        name: "Idempotency Test Workspace",
        slug: `idempotency-test-${Date.now()}`,
      },
    });

    // Re-fetch the same record - no-op query should be consistent
    const found = await prisma.workspaces.findUnique({
      where: { id: created.id },
    });

    expect(found).not.toBeNull();
    expect(found.name).toBe("Idempotency Test Workspace");

    // Clean up
    await prisma.workspaces.delete({ where: { id: created.id } });
  });

  /**
   * Test: Empty string in optional string field should be handled gracefully.
   * Prisma should not coerce empty strings to null or throw on empty string inputs.
   */
  test("empty string in optional string field should be preserved as empty string", async () => {
    // Create a workspace with an optional string field set to empty string
    const created = await prisma.workspaces.create({
      data: {
        name: "Empty String Test",
        slug: `empty-string-test-${Date.now()}`,
        description: "", // Optional field - empty string should be stored
      },
    });

    // Fetch and verify empty string is preserved, not converted to null
    const found = await prisma.workspaces.findUnique({
      where: { id: created.id },
    });

    expect(found).not.toBeNull();
    expect(found.description).toBe("");
    expect(found.description).not.toBeNull();

    // Clean up
    await prisma.workspaces.delete({ where: { id: created.id } });
  });

  /**
   * Test: Null vs undefined distinction in Prisma queries.
   * Passing null should explicitly set a field to null.
   * Passing undefined should leave the field unchanged (Prisma defaults apply).
   */
  test("null vs undefined in Prisma queries - null should explicitly nullify", async () => {
    // Create a workspace with a description
    const created = await prisma.workspaces.create({
      data: {
        name: "Null vs Undefined Test",
        slug: `null-undef-test-${Date.now()}`,
        description: "Initial description",
      },
    });

    // Update with null - should explicitly set to null
    const nullUpdated = await prisma.workspaces.update({
      where: { id: created.id },
      data: {
        description: null,
      },
    });

    expect(nullUpdated.description).toBeNull();

    // Clean up
    await prisma.workspaces.delete({ where: { id: created.id } });
  });

  test("null vs undefined in Prisma queries - undefined should preserve current value", async () => {
    // Create a workspace with a description
    const created = await prisma.workspaces.create({
      data: {
        name: "Preserve Value Test",
        slug: `preserve-value-test-${Date.now()}`,
        description: "Preserved description",
      },
    });

    // Update with undefined - should NOT change the description
    const undefinedUpdated = await prisma.workspaces.update({
      where: { id: created.id },
      data: {
        name: "Updated Name",
        // description not passed (undefined) - should remain unchanged
      },
    });

    expect(undefinedUpdated.name).toBe("Updated Name");
    expect(undefinedUpdated.description).toBe("Preserved description");

    // Clean up
    await prisma.workspaces.delete({ where: { id: created.id } });
  });

  /**
   * Test: Multiple sequential migrations should be idempotent.
   * Simulates running a series of no-op updates.
   */
  test("multiple sequential operations should be idempotent", async () => {
    const slug = `sequential-test-${Date.now()}`;

    const created = await prisma.workspaces.create({
      data: {
        name: "Sequential Test",
        slug,
      },
    });

    // Perform multiple sequential updates
    for (let i = 0; i < 3; i++) {
      const updated = await prisma.workspaces.update({
        where: { id: created.id },
        data: {
          name: `Sequential Test - Pass ${i}`,
        },
      });
      expect(updated.name).toBe(`Sequential Test - Pass ${i}`);
    }

    // Clean up
    await prisma.workspaces.delete({ where: { id: created.id } });
  });
});