import sinon from 'sinon';
import { expect } from 'chai';
import { hasApiKey, isSaveValid, isSearchValid, isNewBook } from '../validations.js';

beforeEach(() => {
    sinon.stub(console, 'log');
});

afterEach(() => {
    console.log.restore();
});
describe('hasApiKey(API_KEY)', () => {
    it('should return true if there is an API_Key set', () => {
        const API_KEY = 'Totally a key here';
        expect(hasApiKey(API_KEY)).to.be.true;
    });
    it('should return false if there is not an API_Key set', () => {
        const API_KEY = undefined;
        expect(hasApiKey(API_KEY)).to.be.false;
    });
});

describe('isSaveValid(input, fetchedBooks)', () => {
    const fetchedBooks = [
        { title: 'Book1', author: 'author1', publisher: 'publisher1' },
        { title: 'Book2', author: 'author2', publisher: 'publisher2' },
        { title: 'Book3', author: 'author3', publisher: 'publisher3' },
        { title: 'Book4', author: 'author4', publisher: 'publisher4' },
        { title: 'Book5', author: 'author5', publisher: 'publisher5' },
    ];
    const goodInput = ['save', '2'];
    const emptyBooks = [];

    it('should return false if only 1 input is provided', () => {
        expect(isSaveValid(['save'], fetchedBooks)).to.be.false;
    });

    it('should return false if no books have been fetched yet', () => {
        expect(isSaveValid(goodInput, emptyBooks)).to.be.false;
    });

    it('should return false if the second input is not a number', () => {
        expect(isSaveValid(['save', 'not a number'], fetchedBooks)).to.be.false;
    });
    it('should return false if the second input less than 1', () => {
        expect(isSaveValid(['save', '0'], fetchedBooks)).to.be.false;
    });
    it('should return false if the second input is greater than the number of fetched books', () => {
        expect(isSaveValid(['save', fetchedBooks.length + 20], fetchedBooks)).to.be.false;
    });
    it('should return true if the second input is greater than 0 and less than the number of fetched books', () => {
        expect(isSaveValid(goodInput, fetchedBooks)).to.be.true;
    });
});

describe('isSearchValid(searchTerm)', () => {
    const goodInput = 'puppy';
    const longButStillGoodInput = 'a really long but very specific sentence I want to search';
    const badInput = '';
    it('should return false if there is no search input', () => {
        expect(isSearchValid(badInput)).to.be.false;
    });
    it('should return true no matter how many search terms are entered at once', () => {
        expect(isSearchValid(goodInput)).to.be.true;
        expect(isSearchValid(longButStillGoodInput)).to.be.true;
    });
});
describe('isNewBook(library, book)', () => {
    const library = [
        { title: 'Book1', author: 'author1', publisher: 'publisher1' },
        { title: 'Book2', author: 'author2', publisher: 'publisher2' },
        { title: 'Book3', author: 'author3', publisher: 'publisher3' },
        { title: 'Book4', author: 'author4', publisher: 'publisher4' },
        { title: 'Book5', author: 'author5', publisher: 'publisher5' },
    ];

    it('should return false if the user tries to save a book that is already on their reading list', () => {
        const oldBook = { title: 'Book5', author: 'author5', publisher: 'publisher5' };
        expect(isNewBook(library, oldBook)).to.be.false;
    });
    it('should return true if the new book is not already on their reading list', () => {
        const newBook = { title: 'Book6', author: 'author6', publisher: 'publisher6' };
        const sameAuthorNewBook = { title: 'NewBook1', author: 'author1', publisher: 'publisher1' };
        expect(isNewBook(library, newBook)).to.be.true;
        expect(isNewBook(library, sameAuthorNewBook)).to.be.true;
    });
});
