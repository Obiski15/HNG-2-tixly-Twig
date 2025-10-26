import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./public/js/main.js",
        login: "./public/js/pages/login.js",
        signup: "./public/js/pages/signup.js",
        dashboard: "./public/js/pages/dashboard.js",
        tickets: "./public/js/pages/tickets.js",
        styles: "./public/css/style.css",
      },
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name].js",
        assetFileNames: "css/[name].[ext]",
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
