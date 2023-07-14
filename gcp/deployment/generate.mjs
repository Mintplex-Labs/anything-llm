import fs from 'fs';  
import { fileURLToPath } from 'url';  
import path, { dirname } from 'path';  
import { exit } from 'process';  
const __dirname = dirname(fileURLToPath(import.meta.url));  
const REPLACEMENT_KEY = '!SUB::USER::CONTENT!'  
  
const envPath = path.resolve(__dirname, `../../docker/.env`)  
const envFileExists = fs.existsSync(envPath);  
  
const chalk = {  
  redBright: function (text) {  
    return `\x1b[31m${text}\x1b[0m`  
  },  
  cyan: function (text) {  
    return `\x1b[36m${text}\x1b[0m`  
  },  
  greenBright: function (text) {  
    return `\x1b[32m${text}\x1b[0m`  
  },  
  blueBright: function (text) {  
    return `\x1b[34m${text}\x1b[0m`  
  }  
}  
  
if (!envFileExists) {  
  console.log(chalk.redBright('[ABORT]'), 'You do not have an .env file in your ./docker/ folder. You need to create it first.');  
  console.log('You can start by running', chalk.cyan('cp -n ./docker/.env.example ./docker/.env'))  
  exit(1);  
}  
  
// Remove comments  
// Remove UID,GID,etc  
// Remove empty strings  
// Split into array  
const settings = fs.readFileSync(envPath, "utf8")  
  .replace(/^#.*\n?/gm, '')  
  .replace(/^UID.*\n?/gm, '')  
  .replace(/^GID.*\n?/gm, '')  
  .replace(/^CLOUD_BUILD.*\n?/gm, '')  
  .replace(/^\s*\n/gm, "")  
  .split('\n')  
  .filter((i) => !!i);
const formattedSettings = settings.map((i, index) => index === 0 ? i + '\n' : '              ' + i).join('\n');  
 
// Read the existing GCP Deployment Manager template  
const templatePath = path.resolve(__dirname, `gcp_deploy_anything_llm.yaml`);  
const templateString = fs.readFileSync(templatePath, "utf8");  
  
// Update the metadata section with the UserData content  
const updatedTemplateString = templateString.replace(REPLACEMENT_KEY, formattedSettings);   
  
// Save the updated GCP Deployment Manager template  
const output = path.resolve(__dirname, `gcp_deploy_anything_llm_with_env.yaml`);  
fs.writeFileSync(output, updatedTemplateString, "utf8");  
  
console.log(chalk.greenBright('[SUCCESS]'), 'Deploy AnythingLLM on GCP Deployment Manager using your template document.');  
console.log(chalk.greenBright('File Created:'), 'gcp_deploy_anything_llm_with_env.yaml in the output directory.');  
console.log(chalk.blueBright('[INFO]'), 'Refer to the GCP Deployment Manager documentation for how to use this file.');  
  
exit();  
