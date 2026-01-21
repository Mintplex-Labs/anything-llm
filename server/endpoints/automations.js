const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

// Mock data for automations - in a real implementation, this would come from a database
const MOCK_CATEGORIES = [
  {
    slug: "business",
    name: "Business",
    description: "Business process automations",
  },
  {
    slug: "marketing",
    name: "Marketing",
    description: "Marketing campaign automations",
  },
  {
    slug: "sales",
    name: "Sales",
    description: "Sales pipeline automations",
  },
  {
    slug: "hr",
    name: "HR",
    description: "HR and recruitment automations",
  },
];

// Mock automation data - replace with actual database queries in production
const MOCK_AUTOMATIONS = {
  business: [
    {
      id: "bus-1",
      name: "Invoice Processing Automation",
      description:
        "Automatically process incoming invoices and update accounting systems",
      active: true,
      category: "business",
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      executions: 145,
    },
    {
      id: "bus-2",
      name: "Expense Approval Workflow",
      description: "Route expense reports through approval chains automatically",
      active: true,
      category: "business",
      lastRun: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      executions: 89,
    },
    {
      id: "bus-3",
      name: "Contract Renewal Reminders",
      description: "Send reminders for upcoming contract renewals",
      active: false,
      category: "business",
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      executions: 34,
    },
  ],
  marketing: [
    {
      id: "mkt-1",
      name: "Email Campaign Scheduler",
      description:
        "Schedule and send email campaigns based on user segmentation",
      active: true,
      category: "marketing",
      lastRun: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      executions: 234,
    },
    {
      id: "mkt-2",
      name: "Social Media Post Automation",
      description: "Automatically post content across social media platforms",
      active: true,
      category: "marketing",
      lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      executions: 167,
    },
    {
      id: "mkt-3",
      name: "Lead Scoring Automation",
      description: "Automatically score and qualify leads based on behavior",
      active: true,
      category: "marketing",
      lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      executions: 892,
    },
  ],
  sales: [
    {
      id: "sales-1",
      name: "Lead Assignment Automation",
      description: "Automatically assign leads to sales representatives",
      active: true,
      category: "sales",
      lastRun: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      executions: 456,
    },
    {
      id: "sales-2",
      name: "Follow-up Email Sequences",
      description: "Send automated follow-up emails based on prospect actions",
      active: true,
      category: "sales",
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      executions: 321,
    },
    {
      id: "sales-3",
      name: "Quote Generation Workflow",
      description: "Automatically generate and send quotes to prospects",
      active: false,
      category: "sales",
      lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      executions: 78,
    },
  ],
  hr: [
    {
      id: "hr-1",
      name: "Onboarding Workflow Automation",
      description: "Automate new employee onboarding tasks and documentation",
      active: true,
      category: "hr",
      lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      executions: 23,
    },
    {
      id: "hr-2",
      name: "Time Off Request Processing",
      description: "Automatically process and approve time off requests",
      active: true,
      category: "hr",
      lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      executions: 156,
    },
    {
      id: "hr-3",
      name: "Performance Review Reminders",
      description: "Send reminders for upcoming performance reviews",
      active: false,
      category: "hr",
      lastRun: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      executions: 45,
    },
  ],
};

// In-memory storage for automation states (in production, use a database)
const automationStates = {};

// Initialize automation states from mock data
Object.entries(MOCK_AUTOMATIONS).forEach(([category, automations]) => {
  automations.forEach((automation) => {
    automationStates[automation.id] = automation.active;
  });
});

function calculateMetrics(automations) {
  const total = automations.length;
  const active = automations.filter((a) => a.active).length;
  const executions = automations.reduce((sum, a) => sum + a.executions, 0);
  const successRate = Math.floor(85 + Math.random() * 15); // Mock success rate

  return {
    total,
    active,
    executions,
    successRate,
  };
}

function automationEndpoints(app) {
  if (!app) return;

  // Get all automation categories
  app.get(
    "/automations/categories",
    [validatedRequest],
    async (_request, response) => {
      try {
        return response.status(200).json({
          success: true,
          categories: MOCK_CATEGORIES,
        });
      } catch (error) {
        console.error("Error fetching automation categories:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  // Get automations by category with metrics
  app.get(
    "/automations/category/:categorySlug",
    [validatedRequest],
    async (request, response) => {
      try {
        const { categorySlug } = request.params;

        // Get automations for this category
        const automations = MOCK_AUTOMATIONS[categorySlug] || [];

        // Update automations with current states
        const updatedAutomations = automations.map((automation) => ({
          ...automation,
          active: automationStates[automation.id] ?? automation.active,
        }));

        // Calculate metrics
        const metrics = calculateMetrics(updatedAutomations);

        return response.status(200).json({
          success: true,
          automations: updatedAutomations,
          metrics,
        });
      } catch (error) {
        console.error("Error fetching category automations:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  // Get a specific automation by ID
  app.get(
    "/automations/:automationId",
    [validatedRequest],
    async (request, response) => {
      try {
        const { automationId } = request.params;

        // Find automation across all categories
        let foundAutomation = null;
        for (const [category, automations] of Object.entries(
          MOCK_AUTOMATIONS
        )) {
          const automation = automations.find((a) => a.id === automationId);
          if (automation) {
            foundAutomation = {
              ...automation,
              active: automationStates[automation.id] ?? automation.active,
            };
            break;
          }
        }

        if (!foundAutomation) {
          return response.status(404).json({
            success: false,
            error: "Automation not found",
          });
        }

        return response.status(200).json({
          success: true,
          automation: foundAutomation,
        });
      } catch (error) {
        console.error("Error fetching automation:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  // Toggle automation active status
  app.post(
    "/automations/:automationId/toggle",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { automationId } = request.params;
        const { active } = request.body;

        if (typeof active !== "boolean") {
          return response.status(400).json({
            success: false,
            error: "Active status must be a boolean",
          });
        }

        // Check if automation exists
        let exists = false;
        for (const automations of Object.values(MOCK_AUTOMATIONS)) {
          if (automations.some((a) => a.id === automationId)) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          return response.status(404).json({
            success: false,
            error: "Automation not found",
          });
        }

        // Update automation state
        automationStates[automationId] = active;

        return response.status(200).json({
          success: true,
          message: `Automation ${active ? "activated" : "deactivated"} successfully`,
        });
      } catch (error) {
        console.error("Error toggling automation:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  // Get metrics for a specific category
  app.get(
    "/automations/category/:categorySlug/metrics",
    [validatedRequest],
    async (request, response) => {
      try {
        const { categorySlug } = request.params;
        const automations = MOCK_AUTOMATIONS[categorySlug] || [];

        // Update automations with current states
        const updatedAutomations = automations.map((automation) => ({
          ...automation,
          active: automationStates[automation.id] ?? automation.active,
        }));

        const metrics = calculateMetrics(updatedAutomations);

        return response.status(200).json({
          success: true,
          metrics,
        });
      } catch (error) {
        console.error("Error fetching category metrics:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );
}

module.exports = { automationEndpoints };
