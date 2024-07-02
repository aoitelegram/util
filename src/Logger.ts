import chalk, { type ForegroundColor } from "chalk";

class Logger {
  static readonly textColors = {
    debug: chalk.whiteBright.bold,
    error: chalk.red.bold,
    warn: chalk.yellow.bold,
    info: chalk.cyan.bold,
  };

  static readonly dateColors = chalk.green.bold;

  /**
   * Logs a message with a specified type and additional arguments.
   *
   * @param type - The log level type.
   * @param args - The arguments to log.
   */
  private static log(
    type: keyof (typeof Logger)["textColors"],
    ...args: unknown[]
  ): void {
    const intlDate = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).format();
    console.log(
      Logger.dateColors(`[${intlDate}]`),
      Logger.textColors[type](`[${type.toUpperCase()}]`),
      ...args.map((arg) =>
        Logger.textColors[type](
          typeof arg === "string" ? arg : JSON.stringify(arg),
        ),
      ),
    );
  }

  /**
   * Logs a custom formatted message.
   *
   * @param options - The options for customizing the log message.
   * @param options.time - Whether to include the current time in the log.
   * @param options.title - The title configuration, including color, text, and boldness.
   * @param options.args - The array of arguments to log, each with its own color, text, and boldness configuration.
   */
  static custom(options: {
    time?: boolean;
    title: {
      color: typeof ForegroundColor;
      text: string;
      bold?: boolean;
    };
    args: {
      color: typeof ForegroundColor;
      text: string;
      bold?: boolean;
    }[];
  }): void {
    const { time, title, args = [] } = options;

    const formattedDate = Logger.dateColors(
      `[${new Date().toLocaleDateString("de-DE")} ${new Date().toLocaleTimeString()}]`,
    );
    const formattedTitle = title.bold
      ? chalk[title.color].bold(title.text)
      : chalk[title.color](title.text);

    let formattedArgs = "";
    if (args && args.length > 0) {
      formattedArgs = args
        .map((arg) =>
          arg.bold
            ? chalk[arg.color].bold(arg.text)
            : chalk[arg.color](arg.text),
        )
        .join(" ");
    }

    if (time) {
      console.log(formattedDate, formattedTitle, formattedArgs);
    } else console.log(formattedTitle, formattedArgs);
  }

  /**
   * Logs a debug message.
   *
   * @param args - The arguments to log.
   */
  static debug(...args: unknown[]): void {
    this.log("debug", ...args);
  }

  /**
   * Logs a error message.
   *
   * @param args - The arguments to log.
   */
  static error(...args: unknown[]): void {
    this.log("error", ...args);
  }

  /**
   * Logs a warn message.
   *
   * @param args - The arguments to log.
   */
  static warn(...args: unknown[]): void {
    this.log("warn", ...args);
  }

  /**
   * Logs a info message.
   *
   * @param args - The arguments to log.
   */
  static info(...args: unknown[]): void {
    this.log("info", ...args);
  }
}

export { Logger };
