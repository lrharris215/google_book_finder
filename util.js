import * as readline from 'readline';

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
