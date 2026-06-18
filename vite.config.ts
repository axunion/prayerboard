import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [solid()],
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: browserslistToTargets(browserslist(">= 0.25%, not dead")),
    },
  },
  build: { cssMinify: "lightningcss" },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
