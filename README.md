# create-config

CC(create-config) is a tool to generate a front-app-configuration-file for web pages' deployment.

## Get Started

```bash
npm i --save-dev create-config
```

Use in your node code, usually at `post-build` stage. Provide the `config` object.

```js
const { createConfig } = require("create-config");

createConfig({
  config: {
    config_api_url: "http://localhost:8080",
  },
});
```

By default, then you can find `dist/_app.config.js` contains the content:

```js
window.APP_CONFIG = {
  "CONFIG_API_URL": "http://localhost:8080"
};
Object.freeze(window.APP_CONFIG);
Object.defineProperty(window, "APP_CONFIG", {
  configurable: false,
  writable: false,
});
```

### options

| key | default | description |
| - | - | - |
| config | - | required |
| output | `"dist"` | - |
| configName | `"APP_CONFIG"` | - |
| configFileName | `"_app.config.js"` | - |
| prefix | `"config_"` | case insensitive |
| packageName | - | optional |


## CLI

We also provide a CLI for convenience when using `npm-scripts`.

```json
{
  "scripts": {
    "post-build": "create-config gen"
  }
}
```

Here is the options(you can get the list by `create-config gen --help`):

```
  -o, --output <string>            output directory where to put the generated file (default: "dist")
  -f, --config-file-name <string>  filename of the generated file (default: "_app.config.js")
  -n, --config-name <string>       the key name of global(window) (default: "APP_CONFIG")
  -x, --prefix <string>            only keys start with the prefix would be preserved (default: "config_")
  -p, --package-name <string>      package name
  -h, --help                       display help for command
```