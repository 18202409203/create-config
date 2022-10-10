const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const { CONFIG_FILE_NAME, CONFIG_NAME, OUTPUT_DIR } = require("./constants");
const { getTemplate } = require("./template");

/**
 * 获取相对于cwd的路径
 */
function getRootPath(...dir) {
  return path.resolve(process.cwd(), ...dir);
}

/**
 * 生成配置文件
 * @param {*} config 配置对象
 */
function createConfig({
  config,
  configName = CONFIG_NAME,
  configFileName = CONFIG_FILE_NAME,
  output = OUTPUT_DIR,
  packageName,
}) {
  try {
    const configStr = getTemplate(configName, config);
    fs.mkdirp(getRootPath(output));
    fs.writeFileSync(getRootPath(`${output}/${configFileName}`), configStr);

    console.log(
      (packageName ? chalk.bgWhite(`[${packageName}]`) : "") +
        chalk.green(` - configuration file is built successfully at `) +
        chalk.cyan(`${output}/${configFileName}`) +
        "\n\n" +
        chalk.magenta(`${JSON.stringify(config, null, 4)}`) +
        "\n"
    );
  } catch (error) {
    console.log(chalk.bgRed("failed when generating configuration file"));
    console.error(error);
  }
}

module.exports = {
  createConfig,
};
