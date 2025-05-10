import ACCESS_SCHEMA from "../../server/utils/AccessManager/schema.js";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const ROLES_DIR = path.join(__dirname, "../../server/utils/AccessManager/defaults");

const defaultRoleDefinitions = [];
for (const file of fs.readdirSync(ROLES_DIR)) {
  const roleDefinition = JSON.parse(fs.readFileSync(path.join(ROLES_DIR, file), "utf8"));
  defaultRoleDefinitions.push(roleDefinition);
}

LegacyRoleMap = {
  // Pre-existing rules that were ROLES.all before the custom role system was introduced
  'all': [

  ]
}

for (const role of defaultRoleDefinitions) {
  console.log(`-> Validating role: ${role.name}`);
  const result = ACCESS_SCHEMA.safeParse(role);
  if (!result.success) console.error(JSON.stringify(result.error, null, 2));
  else console.log(`✅ Standard role '${role.name}' conforms to the standard role schema!`);
}
