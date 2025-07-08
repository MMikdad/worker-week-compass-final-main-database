import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from 'url';
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return {
    server: {
      host: "::",
      port: 8080,
      // To enable HTTPS, place your SSL key and cert as 'localhost-key.pem' and 'localhost-cert.pem' in the project root
      https: fs.existsSync(path.join(__dirname, "localhost-key.pem")) && fs.existsSync(path.join(__dirname, "localhost-cert.pem"))
        ? {
            key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "localhost-cert.pem")),
          }
        : false,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
