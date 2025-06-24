#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const { Command } = require("commander");
const program = new Command();
const { createConfig } = require("..");
const pkg = require("../package.json");
const defaultConfig = require("../constants");
const chalk = require("chalk");

const { cosmiconfig } = require("cosmiconfig");
const explorer = cosmiconfig("create-config");

async function main() {
  const settings = await explorer
    .search()
    .then((result) => ({ ...defaultConfig, ...result.config }))
    .catch(() => defaultConfig);

  program.name(pkg.name).description(pkg.description).version(pkg.version);

  program
    .option(
      "-o, --output <string>",
      "output directory where to put the generated file",
      settings.OUTPUT_DIR
    )
    .option(
      "-f, --config-file-name <string>",
      "filename of the generated file",
      settings.CONFIG_FILE_NAME
    )
    .option(
      "-n, --config-name <string>",
      "the key name of global(window)",
      settings.CONFIG_NAME
    )
    .option(
      "-x, --prefix <string>",
      "only keys start with the prefix would be preserved",
      settings.PREFIX
    )
    .option(
      "-v, --verbose",
      "verbose mode: show specific settings from rc file",
      false
    )
    .action(async ({ output, configName, configFileName, prefix, verbose }) => {
      if (verbose) {
        console.log(settings);
        console.log("\n");
      }

      try {
        let config = {};
        // T1 rc file
        try {
          config = JSON.parse(
            await fs.readFile(path.resolve(process.cwd(), settings.RC), {
              encoding: "utf-8",
            })
          );
        } catch {
          // T2 dotenv file
          let envPath = "";
          try {
            fs.accessSync(settings.ENV_PRODUCTION, fs.constants.F_OK);
            envPath = settings.ENV_PRODUCTION;
          } catch {
            try {
              fs.accessSync(settings.ENV, fs.constants.F_OK);
              envPath = settings.ENV;
            } catch {
              throw new Error();
            }
          }
          require("dotenv").config({ path: envPath });

          Object.keys(process.env).forEach((key) => {
            if (key.startsWith(prefix)) {
              config[key] = process.env[key];
            }
          });
        }

        const packageName = `${process.env.npm_package_name}@${process.env.npm_package_version}`;

        createConfig({
          config,
          configName,
          configFileName,
          output,
          packageName,
        });
      } catch (error) {
        console.log(
          chalk.bgRed(`Cannot find a right file at ${process.cwd()}`)
        );
        console.log(
          `You should have one of [${[
            settings.RC,
            settings.ENV_PRODUCTION,
            settings.ENV,
          ]}]`
        );
      }
    });

  program.parse();
}

main();
