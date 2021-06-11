import axios from 'axios';
import { prompt } from './util.js';

const { API_KEY } = process.env;
const url = 'https://www.googleapis.com/books/v1/volumes?q=';

let running = true;

const getUserInput = () => {
    const q = "What would you like to do? Type 'help' to see a list of commands.\n";
    prompt(q).then((response) => {
        switch (response) {
            case 'help':
                showHelp();
                getUserInput();
                break;
            case 'search':
                fetchBooks('javascript');
                break;
            case 'quit':
                running = false;
                break;
            case 'save':
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
    'save ___' : Saves the book corresponding to the number entered. ex: 'save 2'
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
        console.log(err);
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

while (running) {
    running = false;
    getUserInput();
}
// fetchBooks('puppy');
