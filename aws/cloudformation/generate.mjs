// Note (tcarambat) This script should be executed from root via the `yarn generate::cloudformation` command only.
// This script will copy your current Docker .env settings being used into a slightly custom AWS CloudFormation template
// that you can upload and deploy on AWS in a single click!
// Recommended settings are already defined in the template but you can modify them as needed.
// AnythingLLM can run within the free tier services of AWS (t2.micro w/10GB of storage)
//
// This will deploy a fully public AnythingLLM so if you do not want anyone to access it please set the AUTH_TOKEN & JWT_SECRET envs
// before running this script. You can still run the collector scripts on AWS so no FTP or file uploads are required.
// Your documents and data do not leave your AWS instance when you host in the cloud this way.

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
  .filter((i) => !!i)
  .map((i) => i + '\n')

const templatePath = path.resolve(__dirname, `cf_template.template`);
const templateString = fs.readFileSync(templatePath, "utf8");
const template = JSON.parse(templateString);

const cmdIdx = template.Resources.AnythingLLMInstance.Properties.UserData['Fn::Base64']['Fn::Join'][1].findIndex((cmd) => cmd === REPLACEMENT_KEY)
template.Resources.AnythingLLMInstance.Properties.UserData['Fn::Base64']['Fn::Join'][1].splice(cmdIdx, 1, ...settings);

const output = path.resolve(__dirname, `aws_cf_deploy_anything_llm.json`);
fs.writeFileSync(output, JSON.stringify(template, null, 2), "utf8");

console.log(chalk.greenBright('[SUCCESS]'), 'Deploy AnythingLLM on AWS CloudFormation using your template document.');
console.log(chalk.greenBright('File Created:'), 'aws_cf_deploy_anything_llm.json in aws/cloudformation directory.');
console.log(chalk.blueBright('[INFO]'), 'Refer to aws/cloudformation/DEPLOY.md for how to use this file.');

exit();