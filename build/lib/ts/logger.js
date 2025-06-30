import chalk from "chalk";
export class Logger {
    static log(item) {
        console.log("\n");
        console.log(item);
    }
    static error(item) {
        console.log("\n");
        console.log(chalk.redBright("Error:"), chalk.redBright(item));
    }
    static warn(item) {
        console.log("\n");
        console.log(chalk.yellow("Warning:"), chalk.yellow(item));
    }
    static success(item) {
        console.log("\n");
        console.log(chalk.greenBright(item));
    }
}
