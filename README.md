# create-config

CC(create-config) is a tool to generate a front-app-configuration-file for web pages' deployment.
It supports [`vite`](https://vitejs.dev/) at first priority.

![create-config](result.png)

## Get Started

```bash
npm i --save-dev create-config
```

add a quick script in `package.json`:

```json
{
  "scripts": {
    "config": "create-config"
  }
}
```

If you have a `.env` file, and there are variables starts with `VITE_`

```
VITE_XXXX=XXXX
```

After run `npm run config`, then you can find `dist/_app.config.js` contains the content:

```js
window.APP_CONFIG = {
  VITE_XXXX: "XXXX",
};
Object.freeze(window.APP_CONFIG);
Object.defineProperty(window, "APP_CONFIG", {
  configurable: false,
  writable: false,
});
```

## Usage

### For vite (Strongly recommended)

If you are using vite, you can use our `vite-plugin-create-config`:

```js
// vite.config.js
import { defineConfig } from "vite";
import { vitePluginCreateConfig } from "@zhupengji/create-config/vite-plugin-create-config";

export default defineConfig({
  plugins: [
    // ...
    vitePluginCreateConfig(),
  ],
});
```

Except generated a `dist/_app.config.js` file with `window.APP_CONFIG` definition at `dist`, this plugin would replace
`import.meta.env` content with `window.APP_CONFIG` in production automatically.

### Others (Without vite)

This is also what `vite-plugin-create-config` does. But you need to do these works by yourself if without vite.

1. Modify your html entry file manually or by tools like webpack.

```html
<script src="./_app.config.js"></script>
```

2. Using global config data in condition.

```js
function getGlobalConfig() {
  if (process.env.NODE_ENV === "production") return window["APP_CONFIG"];
  // ... otherwise
}
```

## Cosmiconfig

We use [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to find your config file.

A `create-config.config.js` is expected in the root directory of your project.

Here is the default config file:

```js
module.exports = {
  CONFIG_FILE_NAME: "_app.config.js",
  CONFIG_NAME: "APP_CONFIG",
  PREFIX: "VITE_",
  OUTPUT_DIR: "dist",
  RC: "appConfig.json",
  ENV: ".env",
  ENV_PRODUCTION: ".env.production",
};
```

## Further

### Javascript API

**You will rarely to use this. It's recommended to use in the npm-scripts way.**

Use in your node code, usually at `post-build` stage. Provide the `config` object.

```js
const { createConfig } = require("create-config");

createConfig({
  config: {
    config_api_url: "http://localhost:8080",
  },
});
```

#### options

| key            | default            | description                                    |
| -------------- | ------------------ | ---------------------------------------------- |
| config         | -                  | required                                       |
| output         | `"dist"`           | -                                              |
| configName     | `"APP_CONFIG"`     | -                                              |
| configFileName | `"_app.config.js"` | -                                              |
| prefix         | `"VITE_"`          | case sensitive; if you use vite, maybe `VITE_` |
| packageName    | -                  | `npm_package_name + npm_package_version`       |

### CLI

We provided a CLI for convenience when using `npm-scripts`.

Here is the options(you can get the list by `npx create-config --help`):

```
  -o, --output <string>            output directory where to put the generated file (default: "dist")
  -f, --config-file-name <string>  filename of the generated file (default: "_app.config.js")
  -n, --config-name <string>       the key name of global(window) (default: "APP_CONFIG")
  -x, --prefix <string>            only keys start with the prefix would be preserved (default: "VITE_")
  -h, --help                       display help for command
  -v, --verbose                    verbose mode: show specific settings from rc file
```

### Without `dotenv`

It's recommended to use `dotenv`, which is used widely in modern front-end dev environments.
We automatically read configs from your `.env.production | .env` file.

Besides, there is one more way without `dotenv`. A `appConfig.json` at root is also available.

```
| - appConfig.json
| - .env.production
| - .env
```
