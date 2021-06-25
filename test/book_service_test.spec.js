import sinon from 'sinon';
import axios from 'axios';
import chai, { expect } from 'chai';
import chaifs from 'chai-fs';
import * as fs from 'fs';

import BookService from '../book_service.js';

chai.use(chaifs);

const testPath = './test/save_book_test.json';
const testApiKey = 'faketestingkey';
const book1 = {
    volumeInfo: {
        title: 'book1',
        authors: ['author1'],
        publisher: 'publisher1',
    },
};
const book2 = {
    volumeInfo: {
        title: 'book2',
        authors: ['author2'],
        publisher: 'publisher2',
    },
};
const bookTitleOnly = {
    volumeInfo: {
        title: 'Anonymous Book',
    },
};
const book2Authors = {
    volumeInfo: {
        title: 'book2',
        authors: ['author1', 'author2'],
        publisher: 'publisher2',
    },
};

const testResponse = {
    data: {
        items: [book1, book2],
    },
};

describe('BookService(filePath, api_key)', () => {
    let bookService;

    beforeEach(() => {
        bookService = new BookService(testPath, testApiKey);
    });

    describe('fetchBooks(searchTerm)', () => {
        it('should fetch the books', async () => {
            sinon.stub(axios, 'get').resolves(testResponse);
            await bookService.fetchBooks('test');
            expect(bookService.fetchedBooks).to.eql([
                { title: 'book1', author: 'author1', publisher: 'publisher1' },
                { title: 'book2', author: 'author2', publisher: 'publisher2' },
            ]);
        });
    });

    describe('formatBooks()', () => {
        it('formats the books title, author and publisher correctly', () => {
            expect(bookService.formatBooks([book1])).to.eql([
                { title: 'book1', author: 'author1', publisher: 'publisher1' },
            ]);
        });

        it('formats the book when there is more than 1 author', () => {
            expect(bookService.formatBooks([book2Authors])).to.eql([
                { title: 'book2', author: 'author1, author2', publisher: 'publisher2' },
            ]);
        });

        it('formats the book correctly when there is no author or publisher', () => {
            expect(bookService.formatBooks([bookTitleOnly])).to.eql([
                { title: 'Anonymous Book', author: 'N/A', publisher: 'N/A' },
            ]);
        });
    });

    describe('saveBook(bookNumber)', () => {
        let bookServiceSave;

        before(() => {
            bookServiceSave = new BookService(testPath, testApiKey);
            bookServiceSave.fetchedBooks = [
                { title: 'book1', author: 'author1', publisher: 'publisher1' },
                { title: 'book2', author: 'author2', publisher: 'publisher2' },
            ];
        });

        after(() => {
            fs.unlinkSync('./test/save_book_test.json');
        });

        it('saves a new book to the reading list', () => {
            bookServiceSave.saveBook('1');
            expect(bookServiceSave.fetchReadingList()).to.eql([
                { title: 'book1', author: 'author1', publisher: 'publisher1' },
            ]);
        });

        it('does not erase the previous reading list', () => {
            bookServiceSave.saveBook('2');
            expect(bookServiceSave.fetchReadingList()).to.eql([
                { title: 'book1', author: 'author1', publisher: 'publisher1' },
                { title: 'book2', author: 'author2', publisher: 'publisher2' },
            ]);
        });
    });

    describe('fetchReadingList', () => {
        let bookService1;
        let bookService2;

        before(() => {
            bookService1 = new BookService('./test/json_reader_test.json', testApiKey);
            bookService2 = new BookService(testPath, testApiKey);
        });

        it('returns the saved reading list', () => {
            expect(bookService1.fetchReadingList()).to.eql([
                { title: 'book1', author: 'author1', publisher: 'publisher1' },
            ]);
        });

        it('throws an error if the reading list does not exist yet', () => {
            expect(bookService2.fetchReadingList).to.throw();
        });
    });
});
