# @aoitelegram/util

[![NPM Version](https://img.shields.io/npm/v/@aoitelegram/util)](https://www.npmjs.com/package/@aoitelegram/util)
[![NPM Downloads](https://img.shields.io/npm/dt/@aoitelegram/util.svg?maxAge=3600)](https://www.npmjs.com/package/@aoitelegram/util)
[![License](https://img.shields.io/npm/l/@aoitelegram/util)](https://github.com/aoitelegram/util/blob/main/LICENSE)

A utility library for the aoitelegram project.

## Installation

To use `@aoitelegram/util` in your project, you can install it via npm:

```shell
npm install @aoitelegram/util
```

## Usage

```ts
// Esm/TypeScript
import { Logger } from "@aoitelegram/util";
// CommonJS
const { Logger } = require("@aoitelegram/util");

Logger.info("This is an info message");
Logger.warn("This is a warning message");
Logger.error("This is an error message");

Logger.custom({
  title: {
    text: "[ AoiClient ]:",
    color: "red",
    bold: true,
  },
  args: [
    {
      text: "Initialized on",
      color: "yellow",
      bold: true,
    },
    {
      text: "aoitelegram",
      color: "cyan",
      bold: true,
    },
    {
      text: `v${version}`,
      color: "blue",
      bold: true,
    },
    {
      text: "|",
      color: "yellow",
      bold: true,
    },
    {
      text: username,
      color: "green",
      bold: true,
    },
    {
      text: "|",
      color: "yellow",
      bold: true,
    },
    {
      text: "Sempai Development",
      color: "cyan",
      bold: true,
    },
  ],
});
```

```ts
// Esm/TypeScript
import { ConditionChecker, getObjectKey } from "@aoitelegram/util";
// CommonJS
const { ConditionChecker, getObjectKey } = require("@aoitelegram/util");

console.log(ConditionChecker.checkCondition("1==1")); // true
console.log(ConditionChecker.checkCondition("1!=1")); // false
console.log(
  ConditionChecker.checkCondition("{key:3, key2: 3}=={key2:3, key:3}"),
); // true

const newObj = { key: { key2: true } };
console.log(getObjectKey(newObj, "key")); // { key2: true }
console.log(getObjectKey(newObj, "key.key2")); // true
```

## Documentation

For detailed documentation and usage instructions, please refer to the [aoitelegram Wiki](https://aoitelegram.vercel.app/).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/aoitelegram/util/blob/main/LICENSE) file for details.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create a `GitHub` issue or submit a pull request. Additionally, feel free to reach out to me on Telegram via my group [AoiTelegram](https://t.me/aoitegram) or on Discord using my username `sempaika_chess`.
