import { cloudflare } from "@cloudflare/vite-plugin";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

const isVitest = !!process.env.VITEST;

export default defineConfig({
  plugins: [
    // Cloudflare plugin runs a Worker + miniflare in dev; skip for Vitest (incompatible)
    !isVitest && cloudflare(),
    solid(),
  ].filter(Boolean),
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
