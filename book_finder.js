import axios from 'axios';
import chalk from 'chalk';
import { prompt, jsonReader, jsonWriter, errorLog, successLog } from './util.js';
import { validateApiKey, validateSave, validateSearch, isNewBook } from './validations.js';

const { API_KEY } = process.env;
const url = 'https://www.googleapis.com/books/v1/volumes?q=';
const readingListFilePath = './reading_list.json';

//keeps track of the books returned from a search.
let fetchedBooks = [];

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
            if (validateSearch(searchTerm)) {
                await fetchBooks(searchTerm);
            }
            break;
        case 'quit':
            successLog('Quitting application. Goodbye!');
            return;
        case 'save':
            if (validateSave(responseArr, fetchedBooks)) {
                saveBook(responseArr[1]);
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

    fetchedBooks = formatBooks(response.data.items);

    successLog(`\nTop 5 Books matching '${searchTerm}':\n`);
    printBooks(fetchedBooks);
};

const formatBooks = (books) => {
    return books.map((book) => {
        return {
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'N/A',
            publisher: book.volumeInfo.publisher || 'N/A',
        };
    });
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

const saveBook = (bookNumber) => {
    let idx = parseInt(bookNumber) - 1;
    let book = fetchedBooks[idx];
    let readingList = [];
    try {
        readingList = fetchReadingList(readingListFilePath);
        if (isNewBook(readingList, book)) {
            errorLog('This book is already on your reading list!');
            return;
        }
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
};

if (validateApiKey(API_KEY)) {
    getUserInput();
}
