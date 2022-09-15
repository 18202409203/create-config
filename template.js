module.exports = {
  getTemplate(configName, config) {
    const windowConf = `window.${configName}`;
    return `${windowConf} = ${JSON.stringify(config, null, 2)};
Object.freeze(${windowConf});
Object.defineProperty(window, "${configName}", {
  configurable: false,
  writable: false,
});
`;
  },
};
