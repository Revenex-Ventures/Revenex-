# Website assistant

The browser sends questions to `/api/chat`. Credentials and bounded conversation
history stay on the server. Gemini receives the curated public website facts in
`lib/api-zod/src/chat-knowledge.ts`; this is prompt grounding, not model fine-tuning.
Update that guide when the product changes. Do not include private school data.

Set these **server environment variables** locally in `artifacts/api-server/.env`
and in the production hosting project's environment settings:

```dotenv
CHAT_MODE=ai
CHAT_PROVIDER=gemini
GEMINI_API_KEY=your-server-only-key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Restart the API after changing local environment variables. Never use a `VITE_`
prefix for the API key or commit a real key. Keep `.env` files ignored by Git.

The default model is Google's stable, low-latency Flash-Lite model. Requests keep
default sampling, use low thinking, cap generation at 1,024 tokens and time out
after 12 seconds. See Google's [model documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite),
[generation settings](https://ai.google.dev/gemini-api/docs/generate-content/text-generation),
and [thinking settings](https://ai.google.dev/gemini-api/docs/generate-content/thinking).

Basic FAQs and pricing/security/contact answers use the public knowledge base.
Detailed workflow questions use Gemini. The prompt forbids invented prices,
certifications, private records and booking confirmations. Replies follow the
selected English/Hindi language. Failed, blocked or truncated provider responses
fall back to clearly labelled FAQ assistance in the browser. The server does not
expose provider diagnostics or silently switch a Gemini request to another provider.

Use `CHAT_MODE=faq` to run entirely from the public FAQs. Existing OpenRouter
installations can explicitly select `CHAT_PROVIDER=openrouter` with their own
server configuration. No provider credentials are required for FAQ mode.

Run `pnpm test` for the API, provider-contract, failure-handling and localization
regressions. Tests use isolated fake credentials and never call external providers.

# Hindi presentation

`artifacts/revenex/src/lib/hi-text.json` contains the shared Hindi catalog. Views
subscribe through `useHindiText()` and translate presentation strings during React
rendering. Existing keyed translations in `language-context.tsx` remain supported.
There is no network translation service or DOM text replacement.

Add new English UI copy and its complete Hindi equivalent to the catalog, including
placeholders, accessible labels, errors and preview data. Keep form values, route
identifiers, email addresses and URLs unchanged. The `BrandLogo` component and its
SVG assets are deliberately preserved. Embedded diagrams or screenshots require
their own localized assets if text is added inside an image.
