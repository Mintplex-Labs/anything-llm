import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resources } from "./resources.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendSrc = path.resolve(__dirname, "..");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(
  resources.en.common.common.productName === "AnythingLLM",
  "Expected en.common.productName to be AnythingLLM"
);
assert(
  resources.zh.common.common.productName === "向量知识库",
  "Expected zh.common.productName to be 向量知识库"
);
assert(
  resources.en.common.common.defaultSiteTitle ===
    "AnythingLLM | Your personal LLM trained on anything",
  "Expected en.common.defaultSiteTitle to preserve the existing English title"
);
assert(
  resources.zh.common.common.defaultSiteTitle === "向量知识库",
  "Expected zh.common.defaultSiteTitle to be 向量知识库"
);

const userVisibleEntryFiles = [
  "pages/OnboardingFlow/Steps/Home/index.jsx",
  "components/Modals/Password/SingleUserAuth.jsx",
  "components/Modals/Password/MultiUserAuth.jsx",
  "pages/GeneralSettings/Settings/components/CustomAppName/index.jsx",
  "pages/GeneralSettings/Settings/components/CustomSiteSettings/index.jsx",
];

for (const relativePath of userVisibleEntryFiles) {
  const contents = fs.readFileSync(
    path.join(frontendSrc, relativePath),
    "utf8"
  );
  assert(
    !contents.includes("AnythingLLM"),
    `Unexpected hardcoded AnythingLLM in ${relativePath}`
  );
}

console.log("Branding translation checks passed.");
