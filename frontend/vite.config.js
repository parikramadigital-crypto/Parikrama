import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.DomainUrl": JSON.stringify(env.DomainUrl),
      "process.env.PlaceDomainUrl": JSON.stringify(env.PlaceDomainUrl),
    },
    plugins: [react(), tailwindcss()],
  };
});
