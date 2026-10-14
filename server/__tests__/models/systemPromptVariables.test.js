const { SystemPromptVariables } = require("../../models/systemPromptVariables");
const prisma = require("../../utils/prisma");

const mockUser = {
  id: 1,
  username: "john.doe",
  bio: "I am a test user",
};

const mockWorkspace = {
  id: 1,
  name: "Test Workspace",
  slug: 'test-workspace',
};

const mockSystemPromptVariables = [
  {
    id: 1,
    key: "mystaticvariable",
    value: "AnythingLLM testing runtime",
    description: "A test variable",
    type: "static",
    userId: null,
  },
];

describe("SystemPromptVariables.expandSystemPromptVariables", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock just the Prisma actions since that is what is used by default values
    prisma.system_prompt_variables.findMany = jest.fn().mockResolvedValue(mockSystemPromptVariables);
    prisma.workspaces.findUnique = jest.fn().mockResolvedValue(mockWorkspace);
    prisma.users.findUnique = jest.fn().mockResolvedValue(mockUser);
  });

  it("should expand user-defined system prompt variables", async () => {
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Hello {mystaticvariable}");
    expect(variables).toBe(`Hello ${mockSystemPromptVariables[0].value}`);
  });

  it("should expand the datetime system prompt variable", async () => {
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Current datetime: {datetime}");
    expect(variables).toContain("Current datetime: ");
    expect(variables).not.toContain("{datetime}");
  });

  it("should expand workspace-defined system prompt variables", async () => {
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Hello {workspace.name}", null, mockWorkspace.id);
    expect(variables).toBe(`Hello ${mockWorkspace.name}`);
  });

  it("should expand user-defined system prompt variables", async () => {
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Hello {user.name}", mockUser.id);
    expect(variables).toBe(`Hello ${mockUser.username}`);
  });

  it("should work with any combination of variables", async () => {
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Hello {mystaticvariable} {workspace.name} {user.name}", mockUser.id, mockWorkspace.id);
    expect(variables).toBe(`Hello ${mockSystemPromptVariables[0].value} ${mockWorkspace.name} ${mockUser.username}`);
  });

  it('should fail gracefully with invalid variables that are undefined for any reason', async () => {
    // Undefined sub-fields on valid classes are push to a placeholder [Class prop]. This is expected behavior.
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Hello {invalid.variable} {user.password} the current user is {user.name} on workspace id #{workspace.id}", null, null);
    expect(variables).toBe("Hello {invalid.variable} [User password] the current user is [User name] on workspace id #[Workspace ID]");
  });

  it("preserves $$ and $& in static variable values (String.replace specials)", async () => {
    prisma.system_prompt_variables.findMany = jest.fn().mockResolvedValue([
      {
        id: 2,
        key: "dollars",
        value: "cost is $$5 and matched $& here",
        description: "dollar specials",
        type: "static",
        userId: null,
      },
    ]);
    const out = await SystemPromptVariables.expandSystemPromptVariables(
      "Invoice {dollars}"
    );
    expect(out).toBe("Invoice cost is $$5 and matched $& here");
  });

  it("preserves $` and $' in static variable values", async () => {
    prisma.system_prompt_variables.findMany = jest.fn().mockResolvedValue([
      {
        id: 3,
        key: "ticks",
        value: "before $` after $'",
        description: "tick specials",
        type: "static",
        userId: null,
      },
    ]);
    const out = await SystemPromptVariables.expandSystemPromptVariables(
      "X {ticks} Y"
    );
    expect(out).toBe("X before $` after $' Y");
  });

  it("preserves $ specials in default user and workspace variable values", async () => {
    prisma.users.findUnique = jest.fn().mockResolvedValue({
      ...mockUser,
      username: "$&john",
      bio: "I charge $$50/hr, $` and $' included",
    });
    prisma.workspaces.findUnique = jest.fn().mockResolvedValue({
      ...mockWorkspace,
      name: "Team $& Co",
    });
    const out = await SystemPromptVariables.expandSystemPromptVariables(
      "{user.name} | {user.bio} | {workspace.name}",
      mockUser.id,
      mockWorkspace.id
    );
    expect(out).toBe(
      "$&john | I charge $$50/hr, $` and $' included | Team $& Co"
    );
  });

  it("does not expand placeholders inside inserted user values", async () => {
    prisma.users.findUnique = jest.fn().mockResolvedValue({
      ...mockUser,
      bio: "see {workspace.name}",
    });
    const out = await SystemPromptVariables.expandSystemPromptVariables(
      "{user.bio} | in {workspace.name}",
      mockUser.id,
      mockWorkspace.id
    );
    expect(out).toBe(`see {workspace.name} | in ${mockWorkspace.name}`);
  });

  it("does not expand placeholders inside inserted static values", async () => {
    prisma.system_prompt_variables.findMany = jest.fn().mockResolvedValue([
      {
        id: 4,
        key: "greeting",
        value: "Hi {user.name}",
        description: "nested placeholder",
        type: "static",
        userId: null,
      },
    ]);
    const out = await SystemPromptVariables.expandSystemPromptVariables(
      "{greeting} | {user.name}",
      mockUser.id
    );
    expect(out).toBe(`Hi {user.name} | ${mockUser.username}`);
  });

  it("expands the same placeholder used more than once", async () => {
    const out = await SystemPromptVariables.expandSystemPromptVariables(
      "{user.name} and {user.name} in {workspace.name}",
      mockUser.id,
      mockWorkspace.id
    );
    expect(out).toBe(
      `${mockUser.username} and ${mockUser.username} in ${mockWorkspace.name}`
    );
    expect(prisma.users.findUnique).toHaveBeenCalledTimes(1);
  });

  it("does not expand a user value that references its own placeholder", async () => {
    prisma.users.findUnique = jest.fn().mockResolvedValue({
      ...mockUser,
      bio: "x{user.bio}",
    });
    const out = await SystemPromptVariables.expandSystemPromptVariables(
      "{user.bio} {user.bio}",
      mockUser.id
    );
    expect(out).toBe("x{user.bio} x{user.bio}");
  });

  it("leaves unknown placeholders inside inserted static values as-is", async () => {
    prisma.system_prompt_variables.findMany = jest.fn().mockResolvedValue([
      {
        id: 5,
        key: "wrapper",
        value: "{unknownvariable}",
        description: "unknown nested placeholder",
        type: "static",
        userId: null,
      },
    ]);
    const out = await SystemPromptVariables.expandSystemPromptVariables(
      "{wrapper} {unknownvariable}"
    );
    expect(out).toBe("{unknownvariable} {unknownvariable}");
  });
});
