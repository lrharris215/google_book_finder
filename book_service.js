import axios from 'axios';
import { jsonReader, jsonWriter, errorLog, successLog } from './util.js';
import { isNewBook } from './validations.js';

const URL = 'https://www.googleapis.com/books/v1/volumes?q=';

export default class BookService {
    constructor(filePath, api_key) {
        this.readingListFilePath = filePath;
        this.url = URL;
        this.fetchedBooks = [];
        this.api_key = api_key;
    }

    fetchBooks = async (searchTerm) => {
        const search = `${this.url}${searchTerm}&maxResults=5&key=${this.api_key}`;
        let response;

        try {
            response = await axios.get(search, { headers: { Accept: 'applicaiton/json' } });
        } catch (err) {
            errorLog(err);
            return;
        }

        this.fetchedBooks = this.formatBooks(response.data.items);
        return this.fetchedBooks;
    };

    formatBooks = (books) => {
        return books.map((book) => {
            return {
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'N/A',
                publisher: book.volumeInfo.publisher || 'N/A',
            };
        });
    };

    saveBook = (bookNumber) => {
        let idx = parseInt(bookNumber) - 1;
        let book = this.fetchedBooks[idx];
        let readingList = [];
        try {
            readingList = this.fetchReadingList();
            if (!isNewBook(readingList, book)) {
                errorLog('This book is already on your reading list!');
                return;
            }
            readingList.push(book);
        } catch {
            readingList = [book];
        }
        try {
            jsonWriter(this.readingListFilePath, readingList);
            successLog('Book successfully saved!');
        } catch (err) {
            errorLog(err);
        }
    };

    fetchReadingList = () => {
        const readingList = jsonReader(this.readingListFilePath);
        if (!readingList) {
            throw new Error('Your Reading List is empty!');
        }
        return readingList;
    };
}
