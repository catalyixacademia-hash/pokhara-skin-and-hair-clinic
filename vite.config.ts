import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const useSingleFile = process.env.SINGLE_FILE === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ...(useSingleFile ? [viteSingleFile()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: useSingleFile
    ? undefined
    : {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes("node_modules")) {
                if (id.includes("framer-motion")) return "motion";
                if (id.includes("@supabase")) return "supabase";
                if (id.includes("lenis")) return "lenis";
                if (id.includes("react-dom") || id.includes("/react/")) return "react";
              }
            },
          },
        },
      },
});
