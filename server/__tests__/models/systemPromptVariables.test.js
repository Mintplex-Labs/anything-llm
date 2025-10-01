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
});