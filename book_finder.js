import axios from 'axios';
import chalk from 'chalk';
import { prompt, jsonReader, jsonWriter, errorLog, successLog } from './util.js';
import { validateSave } from './validations.js';

const { API_KEY } = process.env;
const url = 'https://www.googleapis.com/books/v1/volumes?q=';
const readingListFilePath = './reading_list.json';

let fetchedBooks = [];
// let running = true;

const getUserInput = () => {
    const query = `\nWhat would you like to do? Type ${chalk.magentaBright('help')} to see a list of commands.\n\n`;
    prompt(query).then((response) => {
        let responseArr = response.split(' ');
        switch (responseArr[0]) {
            case 'help':
                showHelp();
                getUserInput();
                break;
            case 'search':
                fetchBooks(responseArr[1]).then(() => {
                    getUserInput();
                });
                break;
            case 'quit':
                // running = false;
                successLog('Quitting application. Goodbye!');
                break;
            case 'save':
                if (validateSave(responseArr, fetchedBooks)) {
                    saveBook(responseArr[1]);
                } else {
                    errorLog('That is not a valid input.');
                }

                getUserInput();

                break;
            case 'view':
                viewReadingList();

                break;
            default:
                errorLog('That is not a valid command');
                getUserInput();
                break;
        }
    });
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
    )} : Saves the book to your reading list that corresponds to the number entered. ex: ${chalk.blueBright('save 2')}
    ${chalk.red.bold('quit')} : Exits the application. 
    
    `);
};
const fetchBooks = async (searchTerm) => {
    const search = `${url}${searchTerm}&maxResults=5&key=${API_KEY}`;
    let response;

    try {
        response = await axios({
            method: 'GET',
            url: search,
            headers: { Accept: 'application/json' },
        });
    } catch (err) {
        errorLog(err);
        return;
    }

    const books = formatBooks(response.data.items);

    successLog(`\nTop 5 Books matching '${searchTerm}':\n`);
    printBooks(books);
};

const formatBooks = (books) => {
    const formattedBooks = [];
    console.log(books.length);
    books.forEach((book) => {
        let newBook = {};
        newBook['title'] = book.volumeInfo.title;
        if (!book.volumeInfo.authors) {
            newBook['author'] = 'Anonymous';
        } else {
            newBook['author'] = book.volumeInfo.authors[0];
        }

        newBook['publisher'] = book.volumeInfo.publisher;
        console.log(newBook);
        formattedBooks.push(newBook);
    });

    fetchedBooks = formattedBooks;
    return formattedBooks;
};

const printBooks = (books) => {
    books.forEach((book, idx) => {
        console.log(`${chalk.yellow.bold(`#${idx + 1}:`)}
        Title: ${book.title}
        Author: ${book.author}
        Publisher: ${book.publisher}`);
    });
};

const saveBook = (bookNumber) => {
    let idx = parseInt(bookNumber) - 1;
    let book = fetchedBooks[idx];
    let readingList = [];
    try {
        readingList = fetchReadingList(readingListFilePath);
        readingList.push(book);
    } catch {
        readingList = [book];
    }
    try {
        jsonWriter(readingListFilePath, readingList);
        successLog('Book successfully saved!');
    } catch (err) {
        errorLog(err);
    }
};
const fetchReadingList = () => {
    const readingList = jsonReader(readingListFilePath);
    if (!readingList) {
        throw 'Your Reading List is empty!';
    }
    return readingList;
};

const viewReadingList = () => {
    let readingList;
    try {
        readingList = fetchReadingList();
        console.log(`\n${chalk.yellow.bold('Your Reading List:')}\n`);
        printBooks(readingList);
    } catch (err) {
        errorLog(err);
    }
    getUserInput();
};

// getUserInput();
fetchBooks('cute puppies');
