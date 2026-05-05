# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## CRM AI Assistant (Groq)

The backend exposes a protected AI endpoint at `POST /api/groq/ask`.

This endpoint is configured for CRM analysis and injects a system prompt so responses follow this structure:

- Problem Analysis
- Possible Causes
- Recommended Solution (step-by-step)
- Prevention Tips (optional)

### Server environment variables

Set these in `server/.env`:

- `GROQ_API_KEY=your_groq_api_key`
- `GROQ_API_URL=https://api.groq.ai/openai/v1/chat/completions`
- `GROQ_MODEL=llama-3.1-8b-instant`

### Example request

Use either `input`, `prompt`, or full `messages`.

```json
{
	"input": "There is an anomaly in client payment delay"
}
```

The backend automatically prepends a CRM-specific system instruction when no system message is provided.
