#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const { Command } = require("commander");
const program = new Command();
const { createConfig } = require("..");
const pkg = require("../package.json");
const {
  CONFIG_FILE_NAME,
  CONFIG_NAME,
  OUTPUT_DIR,
  RC,
  ENV,
  ENV_PRODUCTION,
  PREFIX,
} = require("../constants");
const chalk = require("chalk");

program.name(pkg.name).description(pkg.description).version(pkg.version);

program
  .command("gen")
  .alias("generate")
  .description("generate the configuration file")
  .option(
    "-o, --output <string>",
    "output directory where to put the generated file",
    OUTPUT_DIR
  )
  .option(
    "-f, --config-file-name <string>",
    "filename of the generated file",
    CONFIG_FILE_NAME
  )
  .option(
    "-n, --config-name <string>",
    "the key name of global(window)",
    CONFIG_NAME
  )
  .option(
    "-x, --prefix <string>",
    "only keys start with the prefix would be preserved",
    PREFIX
  )
  .option("-p, --package-name <string>", "package name")
  .action(async ({ configName, configFileName, packageName, prefix }) => {
    try {
      let config = {};
      // T1 rc file
      try {
        config = JSON.parse(
          await fs.readFile(path.resolve(process.cwd(), RC), {
            encoding: "utf-8",
          })
        );
      } catch {
        // T2 dotenv file
        let envPath = "";
        try {
          fs.accessSync(ENV_PRODUCTION, fs.constants.F_OK);
          envPath = ENV_PRODUCTION;
        } catch {
          try {
            fs.accessSync(ENV, fs.constants.F_OK);
            envPath = ENV;
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

      createConfig({
        config,
        configName,
        configFileName,
        packageName,
      });
    } catch (error) {
      console.log(chalk.bgRed(`Cannot find a right file at ${process.cwd()}`));
      console.log(`You should have one of [${[RC, ENV_PRODUCTION, ENV]}]`);
    }
  });

program.parse();
