import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const buildVersion = Date.now(); // or use commit hash via child_process.execSync("git rev-parse --short HEAD")

  return {
    base: process.env.GITHUB_ACTIONS ? "/CheszDesignTemplate/" : "/",
    server: {
      host: "::",
      port: 5006,
      proxy: {
        "/api": {
          target:
            process.env.VITE_CHESZ_SERVICE_URL ||
            "https://stagechaszservices.in",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: false,
        },
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      {
        name: "html-transform",
        transformIndexHtml(html: string) {
          // Replace %BUILD_VERSION% with actual timestamp
          return html.replace(/%BUILD_VERSION%/g, buildVersion.toString());
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __BUILD_VERSION__: JSON.stringify(buildVersion),
    },
  };
});
