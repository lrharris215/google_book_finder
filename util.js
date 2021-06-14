import * as readline from 'readline';
import * as fs from 'fs';
import chalk from 'chalk';

export const errorLog = (error) => {
    //chalk this later!!!
    const eLog = chalk.red(chalk.bold('ERROR: ' + error));
    console.log(eLog);
};
export const successLog = (successString) => {
    const sLog = chalk.greenBright(successString);
    console.log(sLog);
};
export const prompt = (question) => {
    const r = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    return new Promise((resolve, error) => {
        r.question(question, (answer) => {
            r.close();
            resolve(answer);
        });
    });
};

export const jsonReader = (filePath) => {
    let data;
    try {
        data = fs.readFileSync(filePath);
    } catch (err) {
        return;
    }
    return JSON.parse(data);
};

export const jsonWriter = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data));
};
