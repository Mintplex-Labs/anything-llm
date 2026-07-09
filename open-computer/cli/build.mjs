import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  outfile: "dist/open-computer",
  banner: { js: "#!/usr/bin/env node" },
});
