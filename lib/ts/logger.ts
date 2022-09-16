import chalk from "chalk";

export class Logger {
    static log(item: any) {
        console.log("\n");
        console.log(item);
    }

    static error(item: any) {
        console.log("\n");
        console.log(chalk.redBright("Error:"), chalk.redBright(item));
    }

    static warn(item: any) {
        console.log("\n");
        console.log(chalk.yellow("Warning:"), chalk.yellow(item));
    }
}