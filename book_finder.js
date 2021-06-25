import chalk from 'chalk';
import { prompt, errorLog, successLog } from './util.js';
import { hasApiKey, isSaveValid, isSearchValid } from './validations.js';
import BookService from './book_service.js';

const { API_KEY } = process.env;

const readingListFilePath = './reading_list.json';

const bookService = new BookService(readingListFilePath, API_KEY);

const getUserInput = async () => {
    const query = `\nWhat would you like to do? Type ${chalk.magentaBright('help')} to see a list of commands.\n\n`;

    const response = await prompt(query);
    let responseArr = response.split(' ');

    switch (responseArr[0]) {
        case 'help':
            showHelp();
            break;
        case 'search':
            let searchTerm = responseArr.slice(1).join(' ');
            if (isSearchValid(searchTerm)) {
                const books = await bookService.fetchBooks(searchTerm);
                successLog(`\nTop 5 Books matching '${searchTerm}':\n`);
                printBooks(books);
            }
            break;
        case 'quit':
            successLog('Quitting application. Goodbye!');
            return;
        case 'save':
            if (isSaveValid(responseArr, bookService.fetchedBooks)) {
                bookService.saveBook(responseArr[1]);
            }
            break;
        case 'view':
            viewReadingList();
            break;
        default:
            errorLog('That is not a valid command');
            break;
    }
    getUserInput();
};

const showHelp = () => {
    console.log(`
        ${chalk.bold('List of commands:')}

        ${chalk.magentaBright.bold('help')} : Shows the command list. 
        ${chalk.green.bold(
            'search ____'
        )} : Searches the Google Books API for books matching your search term. ex: ${chalk.green('search puppies')}
        ${chalk.cyanBright.bold('view')} : fetches the books saved to your reading list. 
        ${chalk.blueBright.bold(
            'save ___'
        )} : Saves the book to your reading list that corresponds to the number entered. ex: ${chalk.blueBright(
        'save 2'
    )}
        ${chalk.red.bold('quit')} : Exits the application. 
        
    `);
};
const printBooks = (books) => {
    books.forEach((book, idx) => {
        console.log(`
    ${chalk.yellow.bold(`#${idx + 1}:`)}
        Title: ${book.title}
        Author(s): ${book.author}
        Publisher: ${book.publisher}
        ${chalk.yellow('_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _')}`);
    });
};

const viewReadingList = () => {
    let readingList;
    try {
        readingList = bookService.fetchReadingList();
        console.log(`\n${chalk.yellow.bold('Your Reading List:')}\n`);
        printBooks(readingList);
    } catch (err) {
        errorLog(err);
    }
};

if (hasApiKey(API_KEY)) {
    getUserInput();
}
