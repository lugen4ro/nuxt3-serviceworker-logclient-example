// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
export default defineNuxtConfig({
  // content: [
  //     "./components/**/*.{js,vue,ts}",
  //     "./layouts/**/*.vue",
  //     "./pages/**/*.vue",
  //     "./plugins/**/*.{js,ts}",
  //     "./app.vue",
  //     "./error.vue",
  // ],
  compatibilityDate: "2024-04-03",
  css: ["~/assets/main.css"],
  plugins: [{ src: "~/plugins/serviceworker.client.ts", mode: "client" }],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
