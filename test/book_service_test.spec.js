import sinon from 'sinon';
import axios from 'axios';
import chai, { expect } from 'chai';
import chaifs from 'chai-fs';
import * as fs from 'fs';

import BookService from '../book_service.js';

chai.use(chaifs);

const testPath = './test/save_book_test.json';
const testApiKey = 'faketestingkey';
const testResponse = {};
describe('BookService(filePath, api_key)', () => {
    // describe('fetchBooks(searchTerm)', () => {
    //     //will need a sinon stub
    //     sinon.stub((axios, 'get')).resolves(testResponse);
    // });

    describe('formatBooks()', () => {
        //formats author/publisher correctly.
    });

    describe('saveBook(bookNumber)', () => {
        let bookService;
        before(() => {
            bookService = new BookService(testPath, testApiKey);
            bookService.fetchedBooks = [
                { title: 'book1', author: 'author1', publisher: 'publisher1' },
                { title: 'book2', author: 'author2', publisher: 'publisher2' },
            ];
        });

        after(() => {
            fs.unlinkSync('./test/save_book_test.json');
        });

        it('saves a new book to the reading list', () => {
            bookService.saveBook('1');
            expect(bookService.fetchReadingList()).to.eql([
                { title: 'book1', author: 'author1', publisher: 'publisher1' },
            ]);
        });
        it('does not erase the previous reading list', () => {
            bookService.saveBook('2');
            expect(bookService.fetchReadingList()).to.eql([
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
