# AnythingLLM Auto-translater

The AnythingLLM Auto-translator is a way for us to translate our locales but at no cost or overhead. However these are expected to be run manually and while they may not be 100% accurate improvement in models have made this work trivial without the need for an api.

## Getting started

- Install Ollama [w/Docker Model Runner](https://ollama.com)
- `ollama pull translategemma:4b`
- `cd extras/translator && cp .env.example .env`

## Run the script

All translations are based on english dictionary. So the English dictionary must have an entry for it to be supported.

`cd extras/translator`

**Target a specific language**
`node index.mjs <lang-code>` eg: `node index.mjs es` for Spanish.

**Do all languages**
`node index.mjs --all` _this is NOT recommended_


## Gotchas

- Sometimes translations go on for a while until the token window is exceeded - you can see this by the massive lines extending beyond the page.
- Some languages operate different with single words or special symbols like "@" and will go off the rails. If the English text is one word and the translated text is 100 words, you dont need to be linguist to know that it is probably wrong.
- You should always review every line for discrepencies or removal of `{{}}` inputs or brand name hallunications eg: `AnyLLM` instead of `AnythingLLM`