import * as esbuild from 'esbuild'
import fs from 'fs';

if (fs.existsSync('./dist')) fs.rmSync('./dist', { recursive: true });
console.log(`esbuild: Bundling server file dependencies into server.js`);
await esbuild.build({
  entryPoints: ['index.js'],
  bundle: true,
  outfile: 'dist/server.js',
  platform: 'node',
  format: 'esm',
  packages: 'external',
  minify: true,
})

fs.cpSync('./swagger', 'dist/swagger', { recursive: true });
fs.cpSync('./swagger/index.css', 'dist/index.css', { recursive: true });
fs.cpSync('./swagger/dark-swagger.css', 'dist/dark-swagger.css', { recursive: true });
fs.cpSync('./node_modules/.prisma', '../dist-server/node_modules/.prisma', { recursive: true });
fs.cpSync('./prisma/migrations', 'dist/prisma/migrations', { recursive: true });
fs.cpSync('./prisma/schema.prisma', 'dist/prisma/schema.prisma', { recursive: true });

// Remap Job imports for bundled structure.
fs.mkdirSync('dist/jobs', { recursive: true });
for (const jobPathObject of fs.readdirSync('./jobs')) {
  if (!jobPathObject.endsWith('.js')) continue;
  // Bundle every job file into its own ESM build so it can run without dependency issues
  console.log(`esbuild: Bundling server/job file ${jobPathObject} into dist/jobs...`);
  await esbuild.build({
    entryPoints: [`jobs/${jobPathObject}`],
    bundle: true,
    outfile: `dist/jobs/${jobPathObject}`,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    minify: true,
  })
}

fs.cpSync('dist', '../dist-server', { recursive: true });