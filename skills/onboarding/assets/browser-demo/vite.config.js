import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const upstream = env.VITE_UNLEASH_FRONTEND_URL ? new URL(env.VITE_UNLEASH_FRONTEND_URL) : undefined;
  return {
    server: {
      // Same-origin development requests avoid making users configure instance CORS for this demo.
      proxy: upstream ? {
        '/unleash-api': {
          target: upstream.origin,
          changeOrigin: true,
          rewrite: (path) => upstream.pathname.replace(/\/$/, '') + path.slice('/unleash-api'.length),
        },
      } : {},
    },
  };
});
