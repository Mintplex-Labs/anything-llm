<a name="readme-top"></a>

> [!NOTE]
> ما همچنین روی [Open Computer](../open-computer) کار می‌کنیم که یک محیط کامل کامپیوتری در اختیار عامل‌های هوش مصنوعی قرار می‌دهد.
>
> این قابلیت‌های عاملِ AnythingLLM را به سطح تازه‌ای می‌رساند و الگوی جدیدی برای تجربه کاربری عامل‌های هوش مصنوعی ارائه می‌کند.
>
> ⭐ برای دریافت آخرین اخبار به مخزن ستاره بدهید!

<p align="center">
  <a href="https://anythingllm.com"><img src="https://github.com/Mintplex-Labs/anything-llm/blob/master/images/wordmark.png?raw=true" alt="AnythingLLM logo"></a>
</p>

<div align='center'>
<a href="https://trendshift.io/repositories/2415" target="_blank"><img src="https://trendshift.io/api/badge/repositories/2415" alt="Mintplex-Labs%2Fanything-llm | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>
</div>

<p align="center" dir="rtl">
    <b>AnythingLLM:</b> اپلیکیشن همه‌کاره هوش مصنوعی که دنبالش بودید.<br />
    با اسناد خود چت کنید، از عامل‌های هوش مصنوعی استفاده کنید، با قابلیت پیکربندی بالا، چند کاربره، و بدون نیاز به تنظیمات پیچیده.
</p>

<p align="center">
  <a href="https://discord.gg/6UyHPeGZAC" target="_blank">
      <img src="https://img.shields.io/badge/chat-mintplex_labs-blue.svg?style=flat&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAH1UExURQAAAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////r6+ubn5+7u7/3+/v39/enq6urq6/v7+97f39rb26eoqT1BQ0pOT4+Rkuzs7cnKykZKS0NHSHl8fdzd3ejo6UxPUUBDRdzc3RwgIh8jJSAkJm5xcvHx8aanqB4iJFBTVezt7V5hYlJVVuLj43p9fiImKCMnKZKUlaaoqSElJ21wcfT09O3u7uvr6zE0Nr6/wCUpK5qcnf7+/nh7fEdKTHx+f0tPUOTl5aipqiouMGtubz5CRDQ4OsTGxufn515hY7a3uH1/gXBydIOFhlVYWvX29qaoqCQoKs7Pz/Pz87/AwUtOUNfY2dHR0mhrbOvr7E5RUy8zNXR2d/f39+Xl5UZJSx0hIzQ3Odra2/z8/GlsbaGjpERHSezs7L/BwScrLTQ4Odna2zM3Obm7u3x/gKSmp9jZ2T1AQu/v71pdXkVISr2+vygsLiInKTg7PaOlpisvMcXGxzk8PldaXPLy8u7u7rm6u7S1tsDBwvj4+MPExbe4ueXm5s/Q0Kyf7ewAAAAodFJOUwAABClsrNjx/QM2l9/7lhmI6jTB/kA1GgKJN+nea6vy/MLZQYeVKK3rVA5tAAAAAWJLR0QB/wIt3gAAAAd0SU1FB+cKBAAmMZBHjXIAAAISSURBVDjLY2CAAkYmZhZWNnYODnY2VhZmJkYGVMDIycXNw6sBBbw8fFycyEoYGfkFBDVQgKAAPyMjQl5IWEQDDYgIC8FUMDKKsmlgAWyiEBWMjGJY5YEqxMAqGMWFNXAAYXGgAkYJSQ2cQFKCkYFRShq3AmkpRgYJbghbU0tbB0Tr6ukbgGhDI10gySfBwCwDUWBsYmpmDqQtLK2sbTQ0bO3sHYA8GWYGWWj4WTs6Obu4ami4OTm7exhqeHp5+4DCVJZBDmqdr7ufn3+ArkZgkJ+fU3CIRmgYWFiOARYGvo5OQUHhEUAFTkF+kVHRsLBgkIeyYmLjwoOc4hMSk5JTnINS06DC8gwcEEZ6RqZGlpOfc3ZObl5+gZ+TR2ERWFyBQQFMF5eklmqUpQb5+ReU61ZUOvkFVVXXQBSAraitq29o1GiKcfLzc29u0mjxBzq0tQ0kww5xZHtHUGeXhkZhdxBYgZ4d0LI6c4gjwd7siQQraOp1AivQ6CuAKZCDBBRQQQNQgUb/BGf3cqCCiZOcnCe3QQIKHNRTpk6bDgpZjRkzg3pBQTBrdtCcuZCgluAD0vPmL1gIdvSixUuWgqNs2YJ+DUhkEYxuggkGmOQUcckrioPTJCOXEnZ5JS5YslbGnuyVERlDDFvGEUPOWvwqaH6RVkHKeuDMK6SKnHlVhTgx8jeTmqy6Eij7K6nLqiGyPwChsa1MUrnq1wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0xMC0wNFQwMDozODo0OSswMDowMB9V0a8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMTAtMDRUMDA6Mzg6NDkrMDA6MDBuCGkTAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTEwLTA0VDAwOjM4OjQ5KzAwOjAwOR1IzAAAAABJRU5ErkJggg==" alt="Discord">
  </a> |
  <a href="https://github.com/Mintplex-Labs/anything-llm/blob/master/LICENSE" target="_blank">
      <img src="https://img.shields.io/static/v1?label=license&message=MIT&color=white" alt="License">
  </a> |
  <a href="https://docs.anythingllm.com" target="_blank">
    مستندات
  </a> |
  <a href="https://my.mintplexlabs.com/aio-checkout?product=anythingllm" target="_blank">
    نمونه میزبانی‌شده
  </a>
</p>

<p align="center">
  <a href='../README.md'>English</a> · <a href='./README.zh-CN.md'>简体中文</a> · <a href='./README.ja-JP.md'>日本語</a> · <a href='./README.tr-TR.md'>Türkçe</a> · <b>فارسی</b>
</p>

<p align="center" dir="rtl">
👈 AnythingLLM برای دسکتاپ (مک، ویندوز و لینوکس)! <a href="https://anythingllm.com/download" target="_blank">دانلود کنید</a>
</p>

<div dir="rtl">
با اسناد خود چت کنید. گردش‌کارهای پیچیده را با عامل‌های هوش مصنوعی خودکار کنید. بسیار قابل پیکربندی، آماده برای چند کاربر، آزموده‌شده در عمل — و به‌صورت پیش‌فرض بدون هیچ دردسری به‌صورت محلی اجرا می‌شود.
</div>

![Chatting](https://github.com/Mintplex-Labs/anything-llm/releases/download/v1.11.2/AnythingLLM720p.gif)

<details>
<summary><kbd>دموی ویدیویی را تماشا کنید!</kbd></summary>

[![تماشای ویدیو](../images/youtube.png)](https://youtu.be/f95rGD9trL0)

</details>

<div dir="rtl">

### نمای کلی محصول

AnythingLLM اپلیکیشن همه‌کاره هوش مصنوعی است که به شما امکان می‌دهد بدون هیچ سازشی یک ChatGPT خصوصی و کاملاً کارآمد بسازید. LLM محلی یا ابری مورد علاقه خود را متصل کنید، اسناد خود را وارد کنید و در عرض چند دقیقه شروع به چت کنید. به‌صورت آماده، عامل‌های داخلی، پشتیبانی چند کاربره، پایگاه‌های داده برداری و خطوط پردازش اسناد را در اختیار دارید — بدون نیاز به پیکربندی اضافی.

AnythingLLM همچنین از چندین کاربر پشتیبانی می‌کند که می‌توانید دسترسی و تجربه هر کاربر را بدون به خطر انداختن امنیت یا حریم خصوصی نمونه یا مالکیت فکری خود کنترل کنید.

## ویژگی‌های جذاب AnythingLLM

- [مسیریابی پویای مدل](https://docs.anythingllm.com/model-router/overview) - بر اساس قواعدی که تعریف می‌کنید، چت‌ها را به‌صورت خودکار به بهترین ارائه‌دهنده و مدل هدایت کنید.
- [حافظه خودکار و مدیریت‌شده توسط کاربر](https://docs.anythingllm.com/features/memories) - کاری کنید LLM شما اطلاعات مهم درباره شما یا فضای کاری‌تان را به خاطر بسپارد.
- [وظایف زمان‌بندی‌شده](https://docs.anythingllm.com/scheduled-jobs/overview) - وظایف یا پرامپت‌های تکرارشونده را با زمان‌بندی cron و با تمام قابلیت‌های عامل اجرا کنید.
- [انتخاب هوشمند مهارت](https://docs.anythingllm.com/agent/intelligent-tool-selection) ابزارهای **نامحدود** را برای مدل‌های خود فعال کنید و در عین حال مصرف توکن هر پرس‌وجو را تا ۸۰٪ کاهش دهید
- [سازنده عامل هوش مصنوعی بدون کدنویسی](https://docs.anythingllm.com/agent-flows/overview)
- [سازگاری با MCP](https://docs.anythingllm.com/mcp-compatibility/overview)
- [پشتیبانی چندوجهی (هم LLMهای متن‌باز و هم تجاری!)](https://docs.anythingllm.com/features/language-models)
- [عامل‌های هوش مصنوعی سفارشی](https://docs.anythingllm.com/agent/custom/introduction)
- 👤 پشتیبانی از نمونه چند کاربره و مدیریت مجوزها _فقط نسخه Docker_
- 🦾 عامل‌ها در فضای کاری شما (مرور وب و غیره)
- 💬 [ویجت چت قابل جاسازی سفارشی برای وب‌سایت شما](https://github.com/Mintplex-Labs/anythingllm-embed/blob/main/README.md) _فقط نسخه Docker_
- 📖 پشتیبانی از انواع مختلف سند (PDF، TXT، DOCX و غیره)
- رابط چت شهودی با بارگذاری کشیدن و رها کردن و ارجاع به منابع.
- آماده تولید برای هر نوع استقرار ابری.
- سازگار با تمام [ارائه‌دهندگان محبوب LLM متن‌باز و تجاری](../README.md#supported-llms-embedder-models-speech-models-and-vector-databases).
- بهینه‌سازی‌های داخلی برای مجموعه اسناد بزرگ — هزینه کمتر و پاسخ سریع‌تر نسبت به سایر رابط‌های چت.
- API کامل توسعه‌دهنده برای یکپارچه‌سازی‌های سفارشی!
- ...و موارد بسیار بیشتر — در چند دقیقه نصب کنید و خودتان ببینید.

### LLMها، مدل‌های Embedder، مدل‌های گفتاری و پایگاه‌های داده برداری پشتیبانی‌شده

</div>

**مدل‌های زبانی بزرگ (LLMs):**

- [Any open-source llama.cpp compatible model](/server/storage/models/README.md#text-generation-llm-selection)
- [OpenAI](https://openai.com)
- [OpenAI (Generic)](https://openai.com)
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
- [AWS Bedrock](https://aws.amazon.com/bedrock/)
- [Anthropic](https://www.anthropic.com/)
- [NVIDIA NIM (chat models)](https://build.nvidia.com/explore/discover)
- [Google Gemini Pro](https://ai.google.dev/)
- [Ollama (chat models)](https://ollama.ai/)
- [LM Studio (all models)](https://lmstudio.ai)
- [LocalAI (all models)](https://localai.io/)
- [Together AI (chat models)](https://www.together.ai/)
- [Fireworks AI (chat models)](https://fireworks.ai/)
- [Perplexity (chat models)](https://www.perplexity.ai/)
- [OpenRouter (chat models)](https://openrouter.ai/)
- [DeepSeek (chat models)](https://deepseek.com/)
- [Mistral](https://mistral.ai/)
- [Groq](https://groq.com/)
- [Cohere](https://cohere.com/)
- [KoboldCPP](https://github.com/LostRuins/koboldcpp)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Text Generation Web UI](https://github.com/oobabooga/text-generation-webui)
- [Apipie](https://apipie.ai/)
- [xAI](https://x.ai/)
- [Z.AI (chat models)](https://z.ai/model-api)
- [Novita AI (chat models)](https://novita.ai/model-api/product/llm-api?utm_source=github_anything-llm&utm_medium=github_readme&utm_campaign=link)
- [PPIO](https://ppinfra.com?utm_source=github_anything-llm)
- [Gitee AI](https://ai.gitee.com/)
- [Moonshot AI](https://www.moonshot.ai/)
- [Microsoft Foundry Local](https://github.com/microsoft/Foundry-Local)
- [CometAPI (chat models)](https://www.cometapi.com/)
- [llmman](https://github.com/llmmanorg/llmman)
- [PrivateModeAI (chat models)](https://privatemode.ai/)
- [SambaNova Cloud (chat models)](https://cloud.sambanova.ai/)
- [Lemonade by AMD](https://lemonade-server.ai)
- [Minimax](https://platform.minimax.io)
- [Cerebras (chat models)](https://www.cerebras.ai/)
- [oMLX](https://github.com/jundot/omlx)

**مدل‌های Embedder:**

- [AnythingLLM Native Embedder](/server/storage/models/README.md) (default)
- [OpenAI](https://openai.com)
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
- [Gemini](https://ai.google.dev/)
- [LocalAI (all)](https://localai.io/)
- [Ollama (all)](https://ollama.ai/)
- [LM Studio (all)](https://lmstudio.ai)
- [Lemonade](https://lemonade-server.ai)
- [OpenRouter](https://openrouter.ai/)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Cohere](https://cohere.com/)
- [Voyage AI](https://www.voyageai.com/)
- [Mistral](https://mistral.ai/)
- Generic OpenAI-compatible embedding APIs

**مدل‌های رونویسی صوتی:**

- [AnythingLLM Built-in](https://github.com/Mintplex-Labs/anything-llm/tree/master/server/storage/models#audiovideo-transcription) (default)
- [OpenAI](https://openai.com/)

**پشتیبانی TTS (تبدیل متن به گفتار):**

- Native Browser Built-in (default)
- [PiperTTSLocal - runs in browser](https://github.com/rhasspy/piper)
- [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech#voice-options)
- [ElevenLabs](https://elevenlabs.io/)
- Any OpenAI Compatible TTS service.

**پشتیبانی STT (تبدیل گفتار به متن):**

- امکانات داخلی مرورگر (پیش‌فرض)

**پایگاه‌های داده برداری:**

- [LanceDB](https://github.com/lancedb/lancedb) (default)
- [PGVector](https://github.com/pgvector/pgvector)
- [Astra DB](https://www.datastax.com/products/datastax-astra)
- [Pinecone](https://pinecone.io)
- [Chroma & ChromaCloud](https://trychroma.com)
- [Weaviate](https://weaviate.io)
- [Qdrant](https://qdrant.tech)
- [Milvus](https://milvus.io)
- [Zilliz](https://zilliz.com)

<div dir="rtl">

### نمای کلی فنی

این تک‌مخزن از شش بخش اصلی تشکیل شده است:

- `frontend`: یک رابط کاربری viteJS + React که می‌توانید برای ایجاد و مدیریت آسان تمام محتوای قابل استفاده توسط LLM اجرا کنید.
- `server`: یک سرور NodeJS express برای مدیریت تمام تعاملات و انجام مدیریت پایگاه داده برداری و تعاملات LLM.
- `collector`: سرور NodeJS express که اسناد را از رابط کاربری پردازش و تجزیه می‌کند.
- `docker`: دستورالعمل‌های Docker و فرآیند ساخت + اطلاعات ساخت از منبع.
- `embed`: زیرماژول برای تولید و ایجاد [ویجت قابل جاسازی وب](https://github.com/Mintplex-Labs/anythingllm-embed).
- `browser-extension`: زیرماژول برای [افزونه مرورگر کروم](https://github.com/Mintplex-Labs/anythingllm-extension).

## 🛳 میزبانی شخصی

Mintplex Labs و جامعه کاربران، روش‌ها، اسکریپت‌ها و قالب‌های متعددی را برای اجرای AnythingLLM به صورت محلی نگهداری می‌کنند. برای مطالعه نحوه استقرار در محیط مورد نظر خود یا استقرار خودکار، به جدول زیر مراجعه کنید.

</div>

| Docker | AWS | GCP | Digital Ocean | Render.com |
|----------------------------------------|----|-----|---------------|------------|
| [![Deploy on Docker][docker-btn]][docker-deploy] | [![Deploy on AWS][aws-btn]][aws-deploy] | [![Deploy on GCP][gcp-btn]][gcp-deploy] | [![Deploy on DigitalOcean][do-btn]][do-deploy] | [![Deploy on Render.com][render-btn]][render-deploy] |

| Railway                                             | RepoCloud                                                 | Elestio                                             | Northflank                                                   | Sealos                                               |
| --------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| [![Deploy on Railway][railway-btn]][railway-deploy] | [![Deploy on RepoCloud][repocloud-btn]][repocloud-deploy] | [![Deploy on Elestio][elestio-btn]][elestio-deploy] | [![Deploy on Northflank][northflank-btn]][northflank-deploy] | [![Deploy on Sealos][sealos-btn]][sealos-deploy] |

<div dir="rtl">

[یا راه‌اندازی نمونه تولیدی AnythingLLM بدون Docker →](../BARE_METAL.md)

## راه‌اندازی برای توسعه

- `yarn setup` برای پر کردن فایل‌های `.env` مورد نیاز در هر بخش از برنامه (از ریشه مخزن).
  - قبل از ادامه، آن‌ها را پر کنید. اطمینان حاصل کنید که `server/.env.development` پر شده است، در غیر این صورت همه چیز درست کار نخواهد کرد.
- `yarn dev:server` برای راه‌اندازی سرور به صورت محلی (از ریشه مخزن).
- `yarn dev:frontend` برای راه‌اندازی فرانت‌اند به صورت محلی (از ریشه مخزن).
- `yarn dev:collector` سپس برای اجرای جمع‌کننده اسناد (از ریشه مخزن).

[درباره اسناد بیشتر بدانید](../server/storage/documents/DOCUMENTS.md)

## تله‌متری و حریم خصوصی

AnythingLLM توسط Mintplex Labs Inc دارای ویژگی تله‌متری است که اطلاعات استفاده ناشناس را جمع‌آوری می‌کند.

</div>

<details>
<summary><kbd>اطلاعات بیشتر درباره تله‌متری و حریم خصوصی AnythingLLM</kbd></summary>

<div dir="rtl">

### چرا؟

ما از این اطلاعات برای درک نحوه استفاده از AnythingLLM، اولویت‌بندی کار روی ویژگی‌های جدید و رفع اشکالات، و بهبود عملکرد و پایداری AnythingLLM استفاده می‌کنیم.

### غیرفعال کردن

برای غیرفعال کردن تله‌متری، `DISABLE_TELEMETRY` را در تنظیمات .env سرور یا داکر خود روی "true" تنظیم کنید. همچنین می‌توانید این کار را در برنامه با رفتن به نوار کناری > `حریم خصوصی` و غیرفعال کردن تله‌متری انجام دهید.

### دقیقاً چه چیزی را ردیابی می‌کنید؟

ما فقط جزئیات استفاده‌ای را که به ما در تصمیم‌گیری‌های محصول و نقشه راه کمک می‌کند ردیابی می‌کنیم، به طور خاص:

- نوع نصب شما (Docker یا Desktop)

- زمانی که سندی اضافه یا حذف می‌شود. هیچ اطلاعاتی _درباره_ خود سند جمع‌آوری نمی‌شود. فقط وقوع رویداد ثبت می‌شود. این به ما درکی از میزان استفاده می‌دهد.

- نوع پایگاه داده برداری در حال استفاده. این به ما کمک می‌کند هنگام انتشار به‌روزرسانی‌های آن ارائه‌دهنده، تغییرات را اولویت‌بندی کنیم.

- نوع ارائه‌دهنده LLM و برچسب مدل در حال استفاده. این به ما کمک می‌کند هنگام انتشار به‌روزرسانی‌ها برای آن ارائه‌دهنده یا مدل یا ترکیب آن‌ها، تغییرات را اولویت‌بندی کنیم. مثلاً: مدل‌های استدلالی در برابر مدل‌های معمولی، مدل‌های چندوجهی و غیره.

- زمانی که چتی ارسال می‌شود. این معمول‌ترین «رویداد» است و به ما درکی از فعالیت روزانه این پروژه در تمام نصب‌ها می‌دهد. باز هم فقط **رویداد** ارسال می‌شود — ما هیچ اطلاعاتی درباره ماهیت یا محتوای خود چت نداریم.

می‌توانید این ادعاها را با پیدا کردن تمام مکان‌هایی که `Telemetry.sendTelemetry` فراخوانی می‌شود تأیید کنید. علاوه بر این، در صورت فعال بودن، این رویدادها در لاگ خروجی نوشته می‌شوند تا داده‌های ارسالی را ببینید. **هیچ IP یا اطلاعات شناسایی دیگری جمع‌آوری نمی‌شود**. ارائه‌دهنده تله‌متری [PostHog](https://posthog.com/) است — یک سرویس متن‌باز جمع‌آوری تله‌متری.

ما حریم خصوصی را بسیار جدی می‌گیریم و امیدواریم درک کنید که می‌خواهیم بدانیم ابزار ما چگونه استفاده می‌شود، بدون استفاده از نظرسنجی‌های آزاردهنده، تا بتوانیم چیزی ارزشمند بسازیم. داده‌های ناشناس _هرگز_ با اشخاص ثالث به اشتراک گذاشته نمی‌شوند.

[مشاهده همه رویدادهای تله‌متری در کد منبع](https://github.com/search?q=repo%3AMintplex-Labs%2Fanything-llm%20.sendTelemetry(&type=code)

### سایر اتصالات خروجی

اگر تله‌متری را غیرفعال کنید، همچنان اتصالات خروجی به سرویس‌های زیر را خواهید دید:

- در صورت استفاده از ابزار خارجی، LLM، مدل‌های Embedding یا پایگاه‌های داده برداری، همچنان اتصالات خروجی به ارائه‌دهنده مربوطه را خواهید دید.
- `cdn.anythingllm.com` برای دریافت مدل‌ها از CDN آینه‌ای ما. این توسط تله‌متری ردیابی نمی‌شود و برای کاربران مناطق با محدودیت VPN مفید است.
- `github/githubusercontent.com` تعدادی فایل تخت از این دامنه‌ها برای کش کردن پنجره زمینه دانلود می‌شود.

در واقع، اگر تله‌متری غیرفعال باشد ما هیچ چیزی جمع‌آوری نمی‌کنیم. با این حال، بسته به پیکربندی شما ممکن است همچنان اتصالات خروجی ببینید و مشمول شرایط خدمات ارائه‌دهنده مربوطه باشید.

</div>

</details>

<div dir="rtl">

## 👋 مشارکت

- [مشارکت در AnythingLLM](../CONTRIBUTING.md) - نحوه مشارکت در AnythingLLM.

## 💖 حامیان

فهرست حامیان در README انگلیسی نگهداری می‌شود، به [Sponsors](../README.md#-sponsors) مراجعه کنید.

## 🌟 مشارکت‌کنندگان

</div>

[![anythingllm contributors](https://contrib.rocks/image?repo=mintplex-labs/anything-llm)](https://github.com/mintplex-labs/anything-llm/graphs/contributors)

[![Star History Chart](https://api.star-history.com/svg?repos=mintplex-labs/anything-llm&type=Timeline)](https://star-history.com/#mintplex-labs/anything-llm&Date)

<div dir="rtl">

## 🔗 محصولات بیشتر

- **[AnythingLLM Mobile (با مجوز MIT)][anythingllm-mobile]:** اپلیکیشن موبایلی که به شما امکان استفاده از AnythingLLM روی دستگاه همراهتان را می‌دهد.
- **[افزونه مرورگر AnythingLLM][anythingllm-extension]:** افزونه مرورگری که امکان استفاده از AnythingLLM در مرورگر را فراهم می‌کند.
- **[AnythingLLM Embed][anythingllm-embed]:** ویجتی که امکان جاسازی AnythingLLM در وب‌سایت شما را فراهم می‌کند.

</div>

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

<div dir="ltr" align="left">

Copyright © 2026 [Mintplex Labs][profile-link]. <br />
This project is [MIT](../LICENSE) licensed.

</div>

<!-- LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-222628?style=flat-square
[profile-link]: https://github.com/mintplex-labs
[anythingllm-mobile]: https://github.com/Mintplex-Labs/anythingllm-mobile
[anythingllm-extension]: https://github.com/Mintplex-Labs/anythingllm-extension
[anythingllm-embed]: https://github.com/Mintplex-Labs/anythingllm-embed
[docker-btn]: ../images/deployBtns/docker.png
[docker-deploy]: ../docker/HOW_TO_USE_DOCKER.md
[aws-btn]: ../images/deployBtns/aws.png
[aws-deploy]: ../cloud-deployments/aws/cloudformation/DEPLOY.md
[gcp-btn]: https://deploy.cloud.run/button.svg
[gcp-deploy]: ../cloud-deployments/gcp/deployment/DEPLOY.md
[do-btn]: https://www.deploytodo.com/do-btn-blue.svg
[do-deploy]: ../cloud-deployments/digitalocean/terraform/DEPLOY.md
[render-btn]: https://render.com/images/deploy-to-render-button.svg
[render-deploy]: https://render.com/deploy?repo=https://github.com/Mintplex-Labs/anything-llm&branch=render
[render-btn]: https://render.com/images/deploy-to-render-button.svg
[render-deploy]: https://render.com/deploy?repo=https://github.com/Mintplex-Labs/anything-llm&branch=render
[railway-btn]: https://railway.app/button.svg
[railway-deploy]: https://railway.app/template/HNSCS1?referralCode=WFgJkn
[repocloud-btn]: https://d16t0pc4846x52.cloudfront.net/deploylobe.svg
[repocloud-deploy]: https://repocloud.io/details/?app_id=276
[elestio-btn]: https://elest.io/images/logos/deploy-to-elestio-btn.png
[elestio-deploy]: https://elest.io/open-source/anythingllm
[northflank-btn]: https://assets.northflank.com/deploy_to_northflank_smm_36700fb050.svg
[northflank-deploy]: https://northflank.com/stacks/deploy-anythingllm
[sealos-btn]: https://sealos.io/Deploy-on-Sealos.svg
[sealos-deploy]: https://sealos.io/products/app-store/anything-llm
