const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const { getTemplate } = require("./template");

function getRootPath(...dir) {
  return path.resolve(process.cwd(), ...dir);
}

async function createConfig({
  config,
  configName,
  configFileName,
  output,
  packageName,
}) {
  try {
    const configStr = getTemplate(configName, config);
    await fs.mkdirp(getRootPath(output));
    await fs.writeFile(getRootPath(`${output}/${configFileName}`), configStr);

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
