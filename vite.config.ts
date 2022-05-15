import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  server: {
    host: "localhost",
    port: 8080,
  },
  build: {
    outDir: "docs",
  },
});
