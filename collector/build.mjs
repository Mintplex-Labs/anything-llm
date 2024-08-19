import * as esbuild from 'esbuild'
import fs from 'fs';

if (fs.existsSync('./dist')) fs.rmSync('./dist', { recursive: true });
console.log(`esbuild: Bundling collector file dependencies into collector.js`);
await esbuild.build({
  entryPoints: ['index.js'],
  bundle: true,
  outfile: '../dist-server/collector.js',
  platform: 'node',
  format: 'esm',
  packages: 'external',
  minify: true,
})