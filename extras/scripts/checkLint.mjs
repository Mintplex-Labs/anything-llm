#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');
const configPath = join(rootDir, '.prettierignore');

const packages = {
  server: {
    name: 'server',
    path: join(rootDir, 'server'),
    params: ['--ignore-path', configPath, '--list-different', './endpoints', './models', './utils', 'index.js'],
  },
  frontend: {
    name: 'frontend',
    path: join(rootDir, 'frontend'),
    params: ['--ignore-path', configPath, '--list-different', './src'],
  },
  collector: {
    name: 'collector',
    path: join(rootDir, 'collector'),
    params: ['--ignore-path', configPath, '--list-different', './processSingleFile', './processLink', './utils', 'index.js'],
  },
};

const hasErrors = [];
for (const pkg of Object.values(packages)) {
  console.log(`\n📦 Linting ${pkg.name}...`);
  try {
    execSync(`yarn prettier ${pkg.params.join(' ')}`, {
      cwd: pkg.path,
      stdio: 'inherit'
    });
  } catch (error) {
    console.error(`\n❌ Linting failed in ${pkg.name}`);
    hasErrors.push(pkg.name);
  }
}

if (hasErrors.length > 0) {
  console.error(`\n❌ Linting failed in ${hasErrors.join(', ')}! Please run \`yarn lint\` at the root of the project to fix any issues.`);
  process.exit(1);
} else {
  console.log('\n✅ All packages passed linting');
}