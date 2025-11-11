import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,          
    environment: "jsdom",   // <— enables DOM for React Testing Library
    setupFiles: "./src/setupTests.ts", 
  },
});