exports.vitePluginCreateConfig = async () => {
  const defaultConfig = require("./constants");
  const { cosmiconfig } = require("cosmiconfig");
  const explorer = cosmiconfig("create-config");
  const settings = await explorer
    .search()
    .then((result) => ({ ...defaultConfig, ...result.config }))
    .catch(() => defaultConfig);

  return {
    name: "vite-plugin-create-config",
    apply: "build",
    transformIndexHtml() {
      return {
        tags: [
          {
            injectTo: "head-prepend",
            tag: "script",
            attrs: {
              src: `${settings.CONFIG_FILE_NAME}`,
            },
          },
        ],
      };
    },
    transform(code) {
      return code.replace(
        new RegExp(`import\\.meta\\.env\\.(${settings.PREFIX}.*)`, "g"),
        `window.${settings.CONFIG_NAME}.$1`
      );
    },
  };
};
