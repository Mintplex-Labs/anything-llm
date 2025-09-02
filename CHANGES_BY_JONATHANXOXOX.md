# Changes by Jonathanxoxox (plain-English summary)

- PR: Mintplex-Labs/anything-llm #4349 - "Feat/customization"
- PR link: https://github.com/Mintplex-Labs/anything-llm/pull/4349
- Source branch: Jonathanxoxox:feat/customization
- Date: 2025-09-01

## What changed and why

- Settings access simplified
  - Only Admins see and access the full Settings in the app UI.
  - Managers can still open manager-allowed pages via direct links.
  - Benefit: reduces clutter for non-admins and prevents accidental global changes.

- Model selection opened up for teams
  - All users can choose the AI model for chats/workspaces they can access.
  - Server checks were adjusted so regular users can update certain workspace settings and register custom models where appropriate.
  - Benefit: teams can try the right model for each task without waiting on an admin.

- Easier cloud deployment
  - Added Railway config and ignore rules.
  - Benefit: simpler, cleaner deployments with fewer unnecessary files.

## What this looks like in the product

- The Settings button/cog no longer appears for non-admin users.
- The model picker in chat is available to all users for workspaces they can use.
- No data migrations required.

## Areas touched (non-technical)

- App navigation: Settings visibility in header/sidebar
- Chat window: model picker control
- Server permissions: who can update a workspace and register custom models
- Deployment: Railway config files

## Reference commits (friendly descriptions)

- aa1ec4d... - Restrict Settings to Admin users only (hide Settings for non-admins in UI)
- 82847ca... - Let all users switch AI models; allow default users to update workspaces and custom models
- 08caed6... - Add Railway deployment config (.railwayignore and railway.json)

For technical details and the full diff, see the PR link above.

## Changed lines (unified diff)

### .railwayignore (added)
```diff
@@
 +node_modules
 +.git
 +.env
 +.env.*
 +*.log
 +.DS_Store
 +.vscode
 +.idea
 +README.md
 +.github
 +images/
 +extras/
 +browser-extension/
 +embed/
 +cloud-deployments/
 +docs/
 +*.md
 +!docker/
```

### railway.json (added)
```diff
@@
 +{
 +  "$schema": "https://railway.app/railway.schema.json",
 +  "build": {
 +    "builder": "dockerfile",
 +    "dockerfilePath": "docker/Dockerfile"
 +  },
 +  "deploy": {
 +    "numReplicas": 1,
 +    "sleepApplication": false,
 +    "restartPolicyType": "ON_FAILURE"
 +  }
 +}
```

### frontend/src/components/SettingsButton/index.jsx
```diff
@@ -8,7 +8,8 @@ export default function SettingsButton() {
   const isInSettings = !!useMatch("/settings/*");
   const { user } = useUser();
 
-  if (user && user?.role === "default") return null;
+  // Only show settings button for admin users
+  if (!user || user?.role !== "admin") return null;
 
   if (isInSettings)
     return (
```

### frontend/src/components/Sidebar/index.jsx
```diff
@@ -155,7 +155,7 @@ export function SidebarMobileHeader() {
                 />
               </div>
-              {(!user || user?.role !== "default") && (
+              {(user && user?.role === "admin") && (
                 <div className="flex gap-x-2 items-center text-slate-500 shink-0">
                   <SettingsButton />
                 </div>
```

### frontend/src/components/WorkspaceChat/ChatContainer/PromptInput/LLMSelector/action.jsx
```diff
@@ -84,9 +84,8 @@ export default function LLMSelectorAction() {
   }, []);
 
-  // This feature is disabled for multi-user instances where the user is not an admin
-  // This is because of the limitations of model selection currently and other nuances in controls.
-  if (!!user && user.role !== "admin") return null;
+  // Enable LLM selector for all user roles
+  // Users can change the model for workspaces they have access to
 
   return (
     <>
```

### server/endpoints/system.js
```diff
@@ -966,7 +966,7 @@ function systemEndpoints(app) {
   app.post(
     "/system/custom-models",
-    [validatedRequest, flexUserRoleValid([ROLES.admin])],
+    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default])],
     async (request, response) => {
       try {
         const { provider, apiKey = null, basePath = null } = reqBody(request);
```

### server/endpoints/workspaces.js
```diff
@@ -84,7 +84,7 @@ function workspaceEndpoints(app) {
   app.post(
     "/workspace/:slug/update",
-    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
+    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default])],
     async (request, response) => {
       try {
         const user = await userFromSession(request, response);
```
