import * as readline from 'readline';
import * as fs from 'fs';
//import chalk from 'chalk';

export const errorLog = (error) => {
    //chalk this later!!!
    const eLog = `Error: ${error}`;
    console.log(eLog);
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

export const jsonReader = (filePath, callback) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return callback && callback(err);
        }
        try {
            const object = JSON.parse(data);
            return callback && callback(null, object);
        } catch (err) {
            return callback && callback(err);
        }
    });
};

export const jsonWriter = (filePath, data) => {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
        if (err) {
            errorLog(err);
        } else {
            console.log('Writing to JSON succeeded!');
        }
    });
};
