import axios from 'axios';
import { prompt, jsonReader, jsonWriter, errorLog } from './util.js';

const { API_KEY } = process.env;
const url = 'https://www.googleapis.com/books/v1/volumes?q=';
const readingListFilePath = './reading_list.json';

let fetchedBooks = [];
// let running = true;

const getUserInput = () => {
    const q = "What would you like to do? Type 'help' to see a list of commands.\n";
    prompt(q).then((response) => {
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
                break;
            case 'save':
                saveBook(responseArr[1]).then(() => {
                    getUserInput();
                });

                break;
            case 'view':
                viewReadingList();

                break;
            default:
                console.log('That is not a valid command');
                getUserInput();
                break;
        }
    });
};
const showHelp = () => {
    console.log(`
    List of commands:

    'help': Shows the command list. 
    'search ____' : Searches the Google Books API for books matching your search term. ex: 'search puppies'
    'view' : fetches the books saved to your reading list. 
    'save ___' : Saves the book to your reading list that corresponds to the number entered. ex: 'save 2'
    'quit': Exits the application. 
    
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
    printBooks(books);
};

const formatBooks = (books) => {
    const formattedBooks = [];
    books.forEach((book) => {
        let newBook = {};
        newBook['title'] = book.volumeInfo.title;
        newBook['author'] = book.volumeInfo.authors[0];
        newBook['publisher'] = book.volumeInfo.publisher;
        formattedBooks.push(newBook);
    });
    fetchedBooks = formattedBooks;
    return formattedBooks;
};

const printBooks = (books) => {
    books.forEach((book, idx) => {
        console.log(`#${idx + 1}: 
        title: ${book.title}
        author: ${book.author}
        publisher: ${book.publisher}`);
    });
};

const saveBook = async (bookNumber) => {
    let idx = parseInt(bookNumber) - 1;
    let book = fetchedBooks[idx];
    console.log(fetchedBooks[idx]);
    await jsonWriter(readingListFilePath, book);
};
const fetchReadingList = async () => {
    return jsonReader(readingListFilePath, (err, savedBooksList) => {
        if (err) {
            errorLog(err);
            return;
        }
        let readingList = savedBooksList.readingList;
        // console.log(readingList);
        // console.log(`inside fetch`);

        return readingList;
    });
};

const viewReadingList = async () => {
    let readingList;
    try {
        readingList = await fetchReadingList();
        console.log('viewReadingList');
        console.log(readingList);
    } catch (err) {
        errorLog(err);
        return;
    }
    // console.log('viewReadingList');
    // console.log(readingList);
};

getUserInput();
