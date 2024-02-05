// What is this script?
// We want to support code syntax highlighting in the embed modal, but we cannot afford to have the static build
// be large in size. To prevent HighlightJs from loading all 193+ language stylings and bloating the script, we instead take a large subset that
// covers most languages and then dynamically build and register each language since HLJS cannot just register with an array of langs.
// Since the embed is a single script - we need to statically import each library and register that associate language.
// we can then export this as a custom implementation of HLJS and call it a day and keep the bundle small.

import fs from 'fs'

const SUPPORTED_HIGHLIGHTS = ['apache', 'bash', 'c', 'cpp', 'csharp', 'css', 'diff', 'go', 'graphql', 'ini', 'java', 'javascript', 'json', 'kotlin', 'less', 'lua', 'makefile', 'markdown', 'nginx', 'objectivec', 'perl', 'pgsql', 'php', 'php-template', 'plaintext', 'python', 'python-repl', 'r', 'ruby', 'rust', 'scss', 'shell', 'sql', 'swift', 'typescript', 'vbnet', 'wasm', 'xml', 'yaml'];
function quickClean(input) {
  return input.replace(/[^a-zA-Z0-9]/g, '');
}

let content = `/*
This is a dynamically generated file to help de-bloat the app since this script is a static bundle.
You should not modify this file directly. You can regenerate it with "node scripts/updateHljs.mjd" from the embed folder.
Last generated ${(new Date).toDateString()}
----------------------
*/\n\n`
content += 'import hljs from "highlight.js/lib/core";\n';

SUPPORTED_HIGHLIGHTS.forEach((lang) => {
  content += `import ${quickClean(lang)}HljsSupport from 'highlight.js/lib/languages/${lang}'\n`;
});

SUPPORTED_HIGHLIGHTS.forEach((lang) => {
  content += ` hljs.registerLanguage('${lang}', ${quickClean(lang)}HljsSupport)\n`;
})

content += `// The above should now register on the languages we wish to support statically.\n`;
content += `export const staticHljs = hljs;\n`

fs.writeFileSync('src/utils/chat/hljs.js', content, { encoding: 'utf8' })
console.log(`Static build of HLJS completed - src/utils/chat/hljs.js`)