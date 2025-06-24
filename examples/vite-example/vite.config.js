import { defineConfig } from "vite";
import { vitePluginCreateConfig } from "@zhupengji/create-config/vite-plugin-create-config";

export default defineConfig({
  plugins: [
    vitePluginCreateConfig(),
  ],
});
