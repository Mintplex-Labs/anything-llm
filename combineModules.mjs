import fs, { rmSync } from 'fs';
import { join } from 'path';
import serverInfo from './server/package.json' assert {type: "json"}
import collectorInfo from './collector/package.json' assert {type: "json"}
import { execSync } from 'child_process'

const outFolder = './dist-server'
const { dependencies: serverDeps } = serverInfo
const { dependencies: collectorDeps } = collectorInfo

if (fs.existsSync(outFolder)) fs.rmSync(outFolder, { recursive: true });
fs.mkdirSync(outFolder);

const mergedDeps = Object.assign({}, serverDeps, collectorDeps);
fs.writeFileSync(join(outFolder, 'package.json'), JSON.stringify({ dependencies: mergedDeps }, null, 2), 'utf8');
execSync(`cd ${outFolder} && yarn install --prod=true`, { stdio: 'inherit' });
execSync(`cp ./prune.sh ${outFolder}/prune.sh && cd ${outFolder} && bash prune.sh`, { stdio: 'inherit' });
rmSync(`${outFolder}/package.json`)
rmSync(`${outFolder}/yarn.lock`)
rmSync(`${outFolder}/prune.sh`)