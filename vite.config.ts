import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { quasar } from "@quasar/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), quasar()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src/"),
      },
    ],
  },
});
