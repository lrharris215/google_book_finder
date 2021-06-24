import { expect } from 'chai';
import { jsonReader, jsonWriter } from '../util.js';

describe('jsonReader(filePath)', () => {
    it('extracts data from json files', () => {
        const data = jsonReader('./test/json_reader_test.json');
        console.log(data);
        expect(data).to.eql([{ title: 'book1', author: 'author1', publisher: 'publisher1' }]);
    });
});

describe('jsonWriter(filePath, data)', () => {
    const newBook1 = { title: 'book1', author: 'author1', publisher: 'publisher1' };
    const newBook2 = { title: 'book2', author: 'author2', publisher: 'publisher2' };
    it('writes data to json file');
    it("creates a new file if one doesn't exist", () => {});
});
