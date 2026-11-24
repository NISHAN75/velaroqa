import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Local development only: makes `npm run dev` serve /api/chat from api/chat.js,
// the same function Vercel runs in production. Reads GEMINI_* values from .env.local.
// (This plugin is not part of the production build.)
function localChatApi() {
  return {
    name: "Velaroqa-local-chat-api",
    apply: "serve",
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, "GEMINI_");
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value;
      }

      server.middlewares.use("/api/chat", async (req, res) => {
        try {
          // Read the JSON body (Vercel does this for us in production)
          const chunks = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 100_000) break;
            chunks.push(chunk);
          }
          try {
            req.body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "null");
          } catch {
            req.body = null;
          }

          const { default: handler } = await server.ssrLoadModule("/api/chat.js");
          await handler(req, res);
        } catch (error) {
          server.config.logger.error(`[chat api] ${error?.message || error}`);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "dev_server_error" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localChatApi()],
});