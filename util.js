import * as readline from 'readline';
import * as fs from 'fs';
import chalk from 'chalk';

export const errorLog = (error) => {
    const eLog = chalk.red(chalk.bold('ERROR: ' + error));
    console.log(eLog);
};
export const successLog = (successString) => {
    const sLog = chalk.greenBright.bold(successString);
    console.log(sLog);
};

//prompts the user to enter an input from the terminal
export const prompt = (question) => {
    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    return new Promise((resolve, reject) => {
        readLine.question(question, (answer) => {
            readLine.close();
            resolve(answer);
        });
    });
};

//reads data from JSON files
export const jsonReader = (filePath) => {
    let data;
    try {
        data = fs.readFileSync(filePath);
    } catch (err) {
        return;
    }
    return JSON.parse(data);
};

//writes data to JSON files
export const jsonWriter = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data));
};
