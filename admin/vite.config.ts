import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const adminBase = env.VITE_ADMIN_BASE?.replace(/\/?$/, '/') ?? '/';

  return {
    base: adminBase,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: { port: 5174 },
  };
});
