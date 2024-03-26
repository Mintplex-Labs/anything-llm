const prisma = require("../utils/prisma");

const WorkspaceMetaResponse = {
  writable: ["name"],

  update: async function (workspaceId, data) {
    try {
      const result = await prisma.workspaces.update({
        where: {
          id: workspaceId,
        },
        data: {
          metaResponseSettings: data,
        },
      });
      return {
        metaResponseSettings: result.metaResponseSettings,
        message: null
      };
    } catch (error) {
      console.error(error.message);
      return { workspace: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const thread = await prisma.workspaces.findFirst({
        where: clause,
      });

      return thread || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.workspaces.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  toggleMetaResponse: async function (workspaceId, status) {
    try {
      const result = await prisma.workspaces.update({
        where: { id: workspaceId },
        data: {
          metaResponse: status,
        },
      });
      return { result, message: null };
    } catch (error) {
      console.error(error.message);
      return { workspace: null, message: error.message };
    }
  },
  defaultSystemPrompt: "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.\ngive user some options",
  defaultSettings: {
    inputs: {
      isEnabled: true,
      config: {
        systemPrompt: {
          isEnabled: true,
          openAiPrompt: "",
          overrideSystemPrompt: false,
          content: "",
          active: 0,
          list: [
            {
              title: "Default",
              content: "",
            },
          ],
          canEdit: ["admin", "manager"],
        },
        promptSchema: {
          active: 0,
          list: [
            {
              title: "Default",
              content: "##  Prompt Guidelines\n- you are a helpful assistant, you will be provided a question to create a list of four elements\n- when  requested to return structured data return them in a JSON object code block , don't introduce them or label them, just return them at the end of your response.\n- When presenting choices or detailed information, encapsulate the data in JSON format, aiming for a user-friendly interaction through:\n\t- type options: you will use this if options are a better way to seak users interaction, include displayTypess: buttons, list,checkbox, or dropdown based on the context.\n\t- type range: you will use this if the user is required to input a numeric between a certain range.\n\t- type rating: you will use this if the user should insert a rating, uswaly between one and five.\n\t- type date: you will use this if the user should insert a date.\n- if asked to return options return them as structured data,  only when asked.\n- always return response as normal in markdown first then  associate  the data structure  object below.\n- make your response rich in markdown.\n- if you find that your response at any time contain options follow the instructions above.\n- Important follow strictly the json schema examples provided below\n---\n### Response Example\n#### Discover More\n**Fascinating Topic**\nExplore intriguing facts and details about your chosen subject, enhancing your understanding and curiosity.\n\n```json\n{\n        \"inputs\": {\n            \"type\": \"options\",\n            \"data\": {\n                \"options\": [\n                    {\n                        \"label\": \"Restart Router\",\n                        \"value\": \"restart router\"\n                    },\n                    {\n                        \"label\": \"Check Service Status\",\n                        \"value\": \"check service status\"\n                    },\n                    ... \n                 ],\n                \"label\":\"Select Server \",\n                \"description\":\"list of servers as described\"\n               \n            },\n            \"settings\": {\n                \"allowMultiple\": false,\n                \"displayType\": \"chose one, buttons/list/dropdown\"\n            }\n        },\n        \"sentiment\": \"happy\",\n        \"style\": \"text\"\n}\n```\n\ninput types:\n```json\n{\n   \"inputs\": {\n   \"type\":\"options\",\n   \"data\":{\n      \"options\":[\n         {\n            \"label\":\"Restart Router\",\n            \"value\":\"restart_router\"\n         },\n         {\n            \"label\":\"Check Service Status\",\n            \"value\":\"check_service_status\"\n         },\n         {\n            \"label\":\"Contact Support\",\n            \"value\":\"contact_support\"\n         }\n      ]\n   },\n   \"settings\":{\n      \"allowMultiple\":false,\n      \"displayType\":\"buttons\"\n   }\n   }\n}\n```\n\n```json\n{\n   \"inputs\": {\n   \"type\":\"range\",\n   \"data\":{\n      \"min\":1,\n      \"max\":10,\n      \"step\":1\n   },\n   \"settings\":{\n      \"showValue\":true\n   }\n   }\n}\n```\n\n```json\n{\n\"inputs\": {\n   \"type\":\"rating\",\n   \"data\":{\n      \"max\":5,\n      \"defaultValue\":3,\n      \"icon\":\"star\"\n   }\n   }\n}\n```\n\n```json\n{\n\"inputs\": {\n   \"type\":\"date\",\n   \"settings\":{\n      \"format\":\"YYYY-MM-DD\",\n      \"minDate\":\"2021-01-01\",\n      \"maxDate\":\"2023-12-31\"\n   }\n}\n}\n```\n---\n",
            },
            {
              title: "Suggestions Buttons Type",
              content: "##  Prompt Guidelines Suggestions Buttons Type\n- you are a helpful assistant, you will be provided a question to create a list of four elements\n- when  requested to return structured data return them in a JSON object code block , don't introduce them or label them, just return them at the end of your response.\n- When presenting choices or detailed information, encapsulate the data in JSON format, aiming for a user-friendly interaction through:\n\t- type options: you will use this if options are a better way to seak users interaction, include displayTypess: buttons, list,checkbox, or dropdown based on the context.\n\t- type range: you will use this if the user is required to input a numeric between a certain range.\n\t- type rating: you will use this if the user should insert a rating, uswaly between one and five.\n\t- type date: you will use this if the user should insert a date.\n- if asked to return options return them as structured data,  only when asked.\n- always return response as normal in markdown first then  associate  the data structure  object below.\n- make your response rich in markdown.\n- if you find that your response at any time contain options follow the instructions above.\n- Important follow strictly the json schema examples provided below\n---\n### Response Example\n#### Discover More\n**Fascinating Topic**\nExplore intriguing facts and details about your chosen subject, enhancing your understanding and curiosity.\n\n```json\n{\n        \"inputs\": {\n            \"type\": \"options\",\n            \"data\": {\n                \"options\": [\n                    {\n                        \"label\": \"Restart Router\",\n                        \"value\": \"restart router\"\n                    },\n                    {\n                        \"label\": \"Check Service Status\",\n                        \"value\": \"check service status\"\n                    },\n                    ... \n                 ],\n                \"label\":\"Select Server \",\n                \"description\":\"list of servers as described\"\n               \n            },\n            \"settings\": {\n                \"allowMultiple\": false,\n                \"displayType\": \"chose one, buttons/list/dropdown\"\n            }\n        },\n        \"sentiment\": \"happy\",\n        \"style\": \"text\"\n}\n```",
            },
          ],
          overrideWorkspacePrompt: false,
          canEdit: ["admin", "manager"],
        },
        components: {
          optionsButtons: {
            isEnabled: true,
            isDefault: true,
            options: [],
            description: "Chat will provide answers with the LLM's general knowledge and document context that is found.",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/options-buttons",
          },
          optionsList: {
            isEnabled: false,
            isDefault: false,
            options: [],
            description: "Best suited  for expansion on a topic",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/options-list",
          },
          multiSelectCheckboxes: {
            isEnabled: false,
            isDefault: false,
            options: [],
            description: "Chat will provide answers with the LLM's general knowledge and document context that is found.",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/multi-select-checkboxes",
          },
          dropDownMenu: {
            isEnabled: false,
            isDefault: false,
            options: [],
            description: "Drop Down menu best to select  between functional derisions, ie: continue, Repeat or Move to a new sequence.. etc",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/dropdown-menu",
          },
        },
      },
      permissions: ["user"],
      description: "Traditionally, interaction with AnythingLLM occurs through a text area. Meta Inputs enhance this by offering alternative interaction methods, including option buttons, multi-select checkboxes, sliders, drop-down menus, and date/time selectors. To utilize these components, you'll need to guide the LLM on incorporating them into its responses with a specific schema",
      infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs",
    },
    sentiments: {
      isEnabled: false,
      config: {
        systemPrompt: {
          isEnabled: false,
          openAiPrompt: "",
          overrideSystemPrompt: false,
          content: "",
          active: 0,
          list: [
            {
              title: "Default",
              content: "",
            },
          ],
          canEdit: ["admin", "manager"],
        },
        promptSchema: {
          active: 0,
          list: [
            {
              title: "Default",
              content: "##  Prompt Guidelines All Input Types\n- you are a helpful assistant, you will be provided a question to create a list of four elements\n- when  requested to return structured data return them in a JSON object code block , don't introduce them or label them, just return them at the end of your response.\n- When presenting choices or detailed information, encapsulate the data in JSON format, aiming for a user-friendly interaction through:\n\t- type options: you will use this if options are a better way to seak users interaction, include displayTypess: buttons, list,checkbox, or dropdown based on the context.\n\t- type range: you will use this if the user is required to input a numeric between a certain range.\n\t- type rating: you will use this if the user should insert a rating, uswaly between one and five.\n\t- type date: you will use this if the user should insert a date.\n- if asked to return options return them as structured data,  only when asked.\n- always return response as normal in markdown first then  associate  the data structure  object below.\n- make your response rich in markdown.\n- if you find that your response at any time contain options follow the instructions above.\n---\n### Response Example\n#### Discover More\n**Fascinating Topic**\nExplore intriguing facts and details about your chosen subject, enhancing your understanding and curiosity.\n\n```json\n{\n        \"inputs\": {\n            \"type\": \"options\",\n            \"data\": {\n                \"options\": [\n                    {\n                        \"label\": \"Restart Router\",\n                        \"value\": \"restart router\"\n                    },\n                    {\n                        \"label\": \"Check Service Status\",\n                        \"value\": \"check service status\"\n                    },\n                    ... \n                 ],\n                \"label\":\"Select Server \",\n                \"description\":\"list of servers as described\"\n               \n            },\n            \"settings\": {\n                \"allowMultiple\": false,\n                \"displayType\": \"chose one, buttons/list/dropdown\"\n            }\n        },\n        \"sentiment\": \"happy\",\n        \"style\": \"text\"\n}\n```\n\ninput types:\n```json\n{\n   \"type\":\"options\",\n   \"data\":{\n      \"options\":[\n         {\n            \"label\":\"Restart Router\",\n            \"value\":\"restart_router\"\n         },\n         {\n            \"label\":\"Check Service Status\",\n            \"value\":\"check_service_status\"\n         },\n         {\n            \"label\":\"Contact Support\",\n            \"value\":\"contact_support\"\n         }\n      ]\n   },\n   \"settings\":{\n      \"allowMultiple\":false,\n      \"displayType\":\"buttons\"\n   }\n}\n```\n\n```json\n{\n   \"type\":\"range\",\n   \"data\":{\n      \"min\":1,\n      \"max\":10,\n      \"step\":1\n   },\n   \"settings\":{\n      \"showValue\":true\n   }\n}\n```\n\n```json\n{\n   \"type\":\"rating\",\n   \"data\":{\n      \"max\":5,\n      \"defaultValue\":3,\n      \"icon\":\"star\"\n   }\n}\n```\n\n```json\n{\n   \"type\":\"date\",\n   \"settings\":{\n      \"format\":\"YYYY-MM-DD\",\n      \"minDate\":\"2021-01-01\",\n      \"maxDate\":\"2023-12-31\"\n   }\n}\n```",
            },
            {
              title: "Suggestions Buttons Type",
              content: "##  Prompt Guidelines Suggestions Buttons Type\n- you are a helpful assistant, you will be provided a question to create a list of four elements\n- when  requested to return structured data return them in a JSON object code block , don't introduce them or label them, just return them at the end of your response.\n- When presenting choices or detailed information, encapsulate the data in JSON format, aiming for a user-friendly interaction through:\n\t- type options: you will use this if options are a better way to seak users interaction, include displayTypess: buttons, list,checkbox, or dropdown based on the context.\n\t- type range: you will use this if the user is required to input a numeric between a certain range.\n\t- type rating: you will use this if the user should insert a rating, uswaly between one and five.\n\t- type date: you will use this if the user should insert a date.\n- if asked to return options return them as structured data,  only when asked.\n- always return response as normal in markdown first then  associate  the data structure  object below.\n- make your response rich in markdown.\n- if you find that your response at any time contain options follow the instructions above.\n---\n### Response Example\n#### Discover More\n**Fascinating Topic**\nExplore intriguing facts and details about your chosen subject, enhancing your understanding and curiosity.\n\n```json\n{\n        \"inputs\": {\n            \"type\": \"options\",\n            \"data\": {\n                \"options\": [\n                    {\n                        \"label\": \"Restart Router\",\n                        \"value\": \"restart router\"\n                    },\n                    {\n                        \"label\": \"Check Service Status\",\n                        \"value\": \"check service status\"\n                    },\n                    ... \n                 ],\n                \"label\":\"Select Server \",\n                \"description\":\"list of servers as described\"\n               \n            },\n            \"settings\": {\n                \"allowMultiple\": false,\n                \"displayType\": \"chose one, buttons/list/dropdown\"\n            }\n        },\n        \"sentiment\": \"happy\",\n        \"style\": \"text\"\n}\n```",
            },
          ],
          overrideWorkspacePrompt: false,
          canEdit: ["admin", "manager"],
        },
        components: {
          optionsButtons: {
            isEnabled: true,
            isDefault: true,
            options: [],
            description: "Chat will provide answers with the LLM's general knowledge and document context that is found.",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/options-buttons",
          },
          optionsList: {
            isEnabled: false,
            isDefault: false,
            options: [],
            description: "Best suited  for expansion on a topic",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/options-list",
          },
          multiSelectCheckboxes: {
            isEnabled: false,
            isDefault: false,
            options: [],
            description: "Chat will provide answers with the LLM's general knowledge and document context that is found.",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/multi-select-checkboxes",
          },
          dropDownMenu: {
            isEnabled: false,
            isDefault: false,
            options: [],
            description: "Drop Down menu best to select  between functional derisions, ie: continue, Repeat or Move to a new sequence.. etc",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/dropdown-menu",
          },
        },
      },
      permissions: ["user"],
      description: "Activate to enable the AI to analyze and adapt its responses based on the emotional tone of the conversation, enhancing interaction personalization",
      infoLink: "https://docs.anythingllm.com/docs/meta-response/sentiments",
    },
    avatars: {
      isEnabled: false,
      config: {
        systemPrompt: {
          isEnabled: false,
          openAiPrompt: "",
          overrideSystemPrompt: false,
          content: "",
          active: 0,
          list: [
            {
              title: "Default",
              content: "",
            },
          ],
          canEdit: ["admin", "manager"],
        },
        promptSchema: {
          active: 0,
          list: [
            {
              title: "All Input Types",
              content: "##  Prompt Guidelines All Input Types\n- you are a helpful assistant, you will be provided a question to create a list of four elements\n- when  requested to return structured data return them in a JSON object code block , don't introduce them or label them, just return them at the end of your response.\n- if asked to return options return them as structured data,  only when asked.\n- always return response as normal in markdown first then  associate  the data structure  object below.\n- make your response rich in markdown.\n- if you find that your response at any time contain options follow the instructions above.\n---\nResponse example:\n#### Discover More\n**Fascinating Topic**\nExplore intriguing facts and details about your chosen subject, enhancing your understanding and curiosity.\n\n```json\n{\n        \"inputs\": {\n            \"type\": \"options\",\n            \"data\": {\n                \"options\": [\n                    {\n                        \"label\": \"Restart Router\",\n                        \"value\": \"restart router\"\n                    },\n                    {\n                        \"label\": \"Check Service Status\",\n                        \"value\": \"check service status\"\n                    },\n                    ... \n                 ],\n                \"label\":\"Select Server \",\n                \"description\":\"list of servers as described\"\n               \n            },\n            \"settings\": {\n                \"allowMultiple\": false,\n                \"displayType\": \"chose one, buttons/list/dropdown\"\n            }\n        },\n        \"sentiment\": \"happy\",\n        \"style\": \"text\"\n}\n```\n\ninput types:\n```json\n{\n   \"inputs\": {\n   \"type\":\"options\",\n   \"data\":{\n      \"options\":[\n         {\n            \"label\":\"Restart Router\",\n            \"value\":\"restart_router\"\n         },\n         {\n            \"label\":\"Check Service Status\",\n            \"value\":\"check_service_status\"\n         },\n         {\n            \"label\":\"Contact Support\",\n            \"value\":\"contact_support\"\n         }\n      ]\n   },\n   \"settings\":{\n      \"allowMultiple\":false,\n      \"displayType\":\"buttons\"\n   }\n   }\n}\n```\n\n```json\n{\n   \"inputs\": {\n   \"type\":\"range\",\n   \"data\":{\n      \"min\":1,\n      \"max\":10,\n      \"step\":1\n   },\n   \"settings\":{\n      \"showValue\":true\n   }\n   }\n}\n```\n\n```json\n{\n\"inputs\": {\n   \"type\":\"rating\",\n   \"data\":{\n      \"max\":5,\n      \"defaultValue\":3,\n      \"icon\":\"star\"\n   }\n   }\n}\n```\n\n```json\n{\n\"inputs\": {\n   \"type\":\"date\",\n   \"settings\":{\n      \"format\":\"YYYY-MM-DD\",\n      \"minDate\":\"2021-01-01\",\n      \"maxDate\":\"2023-12-31\"\n   }\n}\n}\n```",
            },
            {
              title: "Suggestions Buttons Type",
              content: "##  Prompt Guidelines Suggestions Buttons Type\n- you are a helpful assistant, you will be provided a question to create a list of four elements\n- when  requested to return structured data return them in a JSON object code block , don't introduce them or label them, just return them at the end of your response.\n- When presenting choices or detailed information, encapsulate the data in JSON format, aiming for a user-friendly interaction through:\n\t- type options: you will use this if options are a better way to seak users interaction, include displayTypess: buttons, list,checkbox, or dropdown based on the context.\n\t- type range: you will use this if the user is required to input a numeric between a certain range.\n\t- type rating: you will use this if the user should insert a rating, uswaly between one and five.\n\t- type date: you will use this if the user should insert a date.\n- if asked to return options return them as structured data,  only when asked.\n- always return response as normal in markdown first then  associate  the data structure  object below.\n- make your response rich in markdown.\n- if you find that your response at any time contain options follow the instructions above.\n---\n### Response Example\n#### Discover More\n**Fascinating Topic**\nExplore intriguing facts and details about your chosen subject, enhancing your understanding and curiosity.\n\n```json\n{\n        \"inputs\": {\n            \"type\": \"options\",\n            \"data\": {\n                \"options\": [\n                    {\n                        \"label\": \"Restart Router\",\n                        \"value\": \"restart router\"\n                    },\n                    {\n                        \"label\": \"Check Service Status\",\n                        \"value\": \"check service status\"\n                    },\n                    ... \n                 ],\n                \"label\":\"Select Server \",\n                \"description\":\"list of servers as described\"\n               \n            },\n            \"settings\": {\n                \"allowMultiple\": false,\n                \"displayType\": \"chose one, buttons/list/dropdown\"\n            }\n        },\n        \"sentiment\": \"happy\",\n        \"style\": \"text\"\n}\n```",
            },
          ],
          overrideWorkspacePrompt: false,
          canEdit: ["admin", "manager"],
        },
        components: {
          optionsButtons: {
            isEnabled: true,
            isDefault: true,
            options: [],
            description: "Chat will provide answers with the LLM's general knowledge and document context that is found.",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/options-buttons",
          },
          optionsList: {
            isEnabled: false,
            isDefault: false,
            options: [],
            description: "Best suited  for expansion on a topic",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/options-list",
          },
          multiSelectCheckboxes: {
            isEnabled: false,
            isDefault: false,
            options: [],
            description: "Chat will provide answers with the LLM's general knowledge and document context that is found.",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/multi-select-checkboxes",
          },
          dropDownMenu: {
            isEnabled: false,
            isDefault: false,
            options: [],
            description: "Drop Down menu best to select  between functional derisions, ie: continue, Repeat or Move to a new sequence.. etc",
            infoLink: "https://docs.anythingllm.com/docs/meta-response/inputs/dropdown-menu",
          },
        },
      },
      permissions: ["user"],
      description: "Enable avatars to reflect user sentiments, allowing the AI to visually empathize and convey understanding through changes in its profile image based on the meta object's sentiment data.",
      infoLink: "https://docs.anythingllm.com/docs/meta-response/avatars",
    },
  },
};

module.exports = { WorkspaceMetaResponse };
