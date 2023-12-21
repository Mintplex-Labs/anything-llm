import * as esbuild from 'esbuild'
import fs from 'fs';
import { execSync } from 'child_process'

if (fs.existsSync('./dist')) fs.rmSync('./dist', { recursive: true });
await esbuild.build({
  entryPoints: ['index.js'],
  bundle: true,
  outfile: 'dist/index.js',
  platform: 'node',
  format: 'esm',
  packages: 'external'
})
fs.cpSync('./package.json', 'dist/package.json');
fs.cpSync('./yarn.lock', 'dist/yarn.lock');
fs.cpSync('./swagger', 'dist/swagger', { recursive: true });
fs.cpSync('./swagger/index.css', 'dist/index.css', { recursive: true });
fs.cpSync('./swagger/dark-swagger.css', 'dist/dark-swagger.css', { recursive: true });
fs.cpSync('./node_modules/.prisma', 'dist/node_modules/.prisma', { recursive: true });
fs.cpSync('./prisma/migrations', 'dist/prisma/migrations', { recursive: true });
fs.cpSync('./prisma/schema.prisma', 'dist/prisma/schema.prisma', { recursive: true });
execSync('cd dist && yarn install --prod=true');