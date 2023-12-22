import * as esbuild from 'esbuild'
import fs from 'fs';

if (fs.existsSync('./dist')) fs.rmSync('./dist', { recursive: true });
await esbuild.build({
  entryPoints: ['index.js'],
  bundle: true,
  outfile: '../dist-server/collector.js',
  platform: 'node',
  format: 'esm',
  packages: 'external',
})