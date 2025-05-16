import serverPackageJson from '../../server/package.json' assert { type: 'json' };
import collectorPackageJson from '../../collector/package.json' assert { type: 'json' };
const { dependencies: serverDependencies } = serverPackageJson;
const { dependencies: collectorDependencies } = collectorPackageJson;

const serverDependenciesKeys = Object.keys(serverDependencies);
const collectorDependenciesKeys = Object.keys(collectorDependencies);
const commonDependencies = Array.from(new Set([
  ...serverDependenciesKeys.filter((key) => collectorDependenciesKeys.includes(key)),
  ...collectorDependenciesKeys.filter((key) => serverDependenciesKeys.includes(key)),
]));

const ignores = [
  "@langchain/community" // We are slowly removing this dependency from the app - its use is not critical
]

console.log(`${commonDependencies.length} common dependencies found`, commonDependencies);
console.log(`Verifying (serverVersion == collectorVersion) for each common dependency`);

const failed = [];
commonDependencies.forEach((dependency) => {
  console.log(`Verifying ${dependency}: ${serverDependencies[dependency]} == ${collectorDependencies[dependency]}`);
  if (serverDependencies[dependency] !== collectorDependencies[dependency]) {
    if (ignores.includes(dependency)) console.log(`${dependency} is in ignore list.`);
    else failed.push({ dependency, serverVersion: serverDependencies[dependency], collectorVersion: collectorDependencies[dependency] });
  }
});

if (failed.length > 0) {
  console.log(`❌ ${failed.length} dependencies failed to verify`, JSON.stringify(failed, null, 2));
  throw new Error(`${failed.length} dependencies failed to verify!`);
}

console.log(`👍 All dependencies match between server and collector!`);
