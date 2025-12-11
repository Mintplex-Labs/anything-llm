import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "@/App.jsx";
import PrivateRoute, {
  AdminRoute,
  ManagerRoute,
} from "@/components/PrivateRoute";
import Login from "@/pages/Login";
import SimpleSSOPassthrough from "@/pages/Login/SSO/simple";
import OnboardingFlow from "@/pages/OnboardingFlow";
import "@/index.css";

const isDev = process.env.NODE_ENV !== "production";
const REACTWRAP = isDev ? React.Fragment : React.StrictMode;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        lazy: async () => {
          const { default: Main } = await import("@/pages/Main");
          return { element: <PrivateRoute Component={Main} /> };
        },
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/sso/simple",
        element: <SimpleSSOPassthrough />,
      },
      {
        path: "/workspace/:slug/settings/:tab",
        lazy: async () => {
          const { default: WorkspaceSettings } = await import(
            "@/pages/WorkspaceSettings"
          );
          return { element: <ManagerRoute Component={WorkspaceSettings} /> };
        },
      },
      {
        path: "/workspace/:slug",
        lazy: async () => {
          const { default: WorkspaceChat } = await import(
            "@/pages/WorkspaceChat"
          );
          return { element: <PrivateRoute Component={WorkspaceChat} /> };
        },
      },
      {
        path: "/workspace/:slug/t/:threadSlug",
        lazy: async () => {
          const { default: WorkspaceChat } = await import(
            "@/pages/WorkspaceChat"
          );
          return { element: <PrivateRoute Component={WorkspaceChat} /> };
        },
      },
      {
        path: "/accept-invite/:code",
        lazy: async () => {
          const { default: InvitePage } = await import("@/pages/Invite");
          return { element: <InvitePage /> };
        },
      },
      // Admin routes
      {
        path: "/settings/llm-preference",
        lazy: async () => {
          const { default: GeneralLLMPreference } = await import(
            "@/pages/GeneralSettings/LLMPreference"
          );
          return { element: <AdminRoute Component={GeneralLLMPreference} /> };
        },
      },
      {
        path: "/settings/transcription-preference",
        lazy: async () => {
          const { default: GeneralTranscriptionPreference } = await import(
            "@/pages/GeneralSettings/TranscriptionPreference"
          );
          return {
            element: <AdminRoute Component={GeneralTranscriptionPreference} />,
          };
        },
      },
      {
        path: "/settings/audio-preference",
        lazy: async () => {
          const { default: GeneralAudioPreference } = await import(
            "@/pages/GeneralSettings/AudioPreference"
          );
          return {
            element: <AdminRoute Component={GeneralAudioPreference} />,
          };
        },
      },
      {
        path: "/settings/embedding-preference",
        lazy: async () => {
          const { default: GeneralEmbeddingPreference } = await import(
            "@/pages/GeneralSettings/EmbeddingPreference"
          );
          return {
            element: <AdminRoute Component={GeneralEmbeddingPreference} />,
          };
        },
      },
      {
        path: "/settings/text-splitter-preference",
        lazy: async () => {
          const { default: EmbeddingTextSplitterPreference } = await import(
            "@/pages/GeneralSettings/EmbeddingTextSplitterPreference"
          );
          return {
            element: <AdminRoute Component={EmbeddingTextSplitterPreference} />,
          };
        },
      },
      {
        path: "/settings/vector-database",
        lazy: async () => {
          const { default: GeneralVectorDatabase } = await import(
            "@/pages/GeneralSettings/VectorDatabase"
          );
          return {
            element: <AdminRoute Component={GeneralVectorDatabase} />,
          };
        },
      },
      {
        path: "/settings/agents",
        lazy: async () => {
          const { default: AdminAgents } = await import("@/pages/Admin/Agents");
          return { element: <AdminRoute Component={AdminAgents} /> };
        },
      },
      {
        path: "/settings/agents/builder",
        lazy: async () => {
          const { default: AgentBuilder } = await import(
            "@/pages/Admin/AgentBuilder"
          );
          return {
            element: (
              <AdminRoute Component={AgentBuilder} hideUserMenu={true} />
            ),
          };
        },
      },
      {
        path: "/settings/agents/builder/:flowId",
        lazy: async () => {
          const { default: AgentBuilder } = await import(
            "@/pages/Admin/AgentBuilder"
          );
          return {
            element: (
              <AdminRoute Component={AgentBuilder} hideUserMenu={true} />
            ),
          };
        },
      },
      {
        path: "/settings/event-logs",
        lazy: async () => {
          const { default: AdminLogs } = await import("@/pages/Admin/Logging");
          return { element: <AdminRoute Component={AdminLogs} /> };
        },
      },
      {
        path: "/settings/embed-chat-widgets",
        lazy: async () => {
          const { default: ChatEmbedWidgets } = await import(
            "@/pages/GeneralSettings/ChatEmbedWidgets"
          );
          return { element: <AdminRoute Component={ChatEmbedWidgets} /> };
        },
      },
      // Manager routes
      {
        path: "/settings/security",
        lazy: async () => {
          const { default: GeneralSecurity } = await import(
            "@/pages/GeneralSettings/Security"
          );
          return { element: <ManagerRoute Component={GeneralSecurity} /> };
        },
      },
      {
        path: "/settings/privacy",
        lazy: async () => {
          const { default: PrivacyAndData } = await import(
            "@/pages/GeneralSettings/PrivacyAndData"
          );
          return { element: <AdminRoute Component={PrivacyAndData} /> };
        },
      },
      {
        path: "/settings/interface",
        lazy: async () => {
          const { default: InterfaceSettings } = await import(
            "@/pages/GeneralSettings/Settings/Interface"
          );
          return { element: <ManagerRoute Component={InterfaceSettings} /> };
        },
      },
      {
        path: "/settings/branding",
        lazy: async () => {
          const { default: BrandingSettings } = await import(
            "@/pages/GeneralSettings/Settings/Branding"
          );
          return { element: <ManagerRoute Component={BrandingSettings} /> };
        },
      },
      {
        path: "/settings/default-system-prompt",
        lazy: async () => {
          const { default: DefaultSystemPrompt } = await import(
            "@/pages/Admin/DefaultSystemPrompt"
          );
          return { element: <AdminRoute Component={DefaultSystemPrompt} /> };
        },
      },
      {
        path: "/settings/chat",
        lazy: async () => {
          const { default: ChatSettings } = await import(
            "@/pages/GeneralSettings/Settings/Chat"
          );
          return { element: <ManagerRoute Component={ChatSettings} /> };
        },
      },
      {
        path: "/settings/beta-features",
        lazy: async () => {
          const { default: ExperimentalFeatures } = await import(
            "@/pages/Admin/ExperimentalFeatures"
          );
          return { element: <AdminRoute Component={ExperimentalFeatures} /> };
        },
      },
      {
        path: "/settings/api-keys",
        lazy: async () => {
          const { default: GeneralApiKeys } = await import(
            "@/pages/GeneralSettings/ApiKeys"
          );
          return { element: <AdminRoute Component={GeneralApiKeys} /> };
        },
      },
      {
        path: "/settings/system-prompt-variables",
        lazy: async () => {
          const { default: SystemPromptVariables } = await import(
            "@/pages/Admin/SystemPromptVariables"
          );
          return {
            element: <AdminRoute Component={SystemPromptVariables} />,
          };
        },
      },
      {
        path: "/settings/browser-extension",
        lazy: async () => {
          const { default: GeneralBrowserExtension } = await import(
            "@/pages/GeneralSettings/BrowserExtensionApiKey"
          );
          return {
            element: <ManagerRoute Component={GeneralBrowserExtension} />,
          };
        },
      },
      {
        path: "/settings/workspace-chats",
        lazy: async () => {
          const { default: GeneralChats } = await import(
            "@/pages/GeneralSettings/Chats"
          );
          return { element: <ManagerRoute Component={GeneralChats} /> };
        },
      },
      {
        path: "/settings/invites",
        lazy: async () => {
          const { default: AdminInvites } = await import(
            "@/pages/Admin/Invitations"
          );
          return { element: <ManagerRoute Component={AdminInvites} /> };
        },
      },
      {
        path: "/settings/users",
        lazy: async () => {
          const { default: AdminUsers } = await import("@/pages/Admin/Users");
          return { element: <ManagerRoute Component={AdminUsers} /> };
        },
      },
      {
        path: "/settings/workspaces",
        lazy: async () => {
          const { default: AdminWorkspaces } = await import(
            "@/pages/Admin/Workspaces"
          );
          return { element: <ManagerRoute Component={AdminWorkspaces} /> };
        },
      },
      // Onboarding Flow
      {
        path: "/onboarding",
        element: <OnboardingFlow />,
      },
      {
        path: "/onboarding/:step",
        element: <OnboardingFlow />,
      },
      // Experimental feature pages
      {
        path: "/settings/beta-features/live-document-sync/manage",
        lazy: async () => {
          const { default: LiveDocumentSyncManage } = await import(
            "@/pages/Admin/ExperimentalFeatures/Features/LiveSync/manage"
          );
          return {
            element: <AdminRoute Component={LiveDocumentSyncManage} />,
          };
        },
      },
      {
        path: "/settings/community-hub/trending",
        lazy: async () => {
          const { default: CommunityHubTrending } = await import(
            "@/pages/GeneralSettings/CommunityHub/Trending"
          );
          return { element: <AdminRoute Component={CommunityHubTrending} /> };
        },
      },
      {
        path: "/settings/community-hub/authentication",
        lazy: async () => {
          const { default: CommunityHubAuthentication } = await import(
            "@/pages/GeneralSettings/CommunityHub/Authentication"
          );
          return {
            element: <AdminRoute Component={CommunityHubAuthentication} />,
          };
        },
      },
      {
        path: "/settings/community-hub/import-item",
        lazy: async () => {
          const { default: CommunityHubImportItem } = await import(
            "@/pages/GeneralSettings/CommunityHub/ImportItem"
          );
          return {
            element: <AdminRoute Component={CommunityHubImportItem} />,
          };
        },
      },
      {
        path: "/settings/mobile-connections",
        lazy: async () => {
          const { default: MobileConnections } = await import(
            "@/pages/GeneralSettings/MobileConnections"
          );
          return { element: <ManagerRoute Component={MobileConnections} /> };
        },
      },
      // Catch-all route for 404s
      {
        path: "*",
        lazy: async () => {
          const { default: NotFound } = await import("@/pages/404");
          return { element: <NotFound /> };
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <REACTWRAP>
    <RouterProvider router={router} />
  </REACTWRAP>
);
