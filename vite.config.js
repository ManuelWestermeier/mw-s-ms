import { defineConfig } from "vite";

export default defineConfig({
    base: "mw-s-ms",
    build: {
        outDir: "docs",
    },
    server: {
        port: 26228,
    }
});