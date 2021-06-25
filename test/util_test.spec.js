import chai, { expect } from 'chai';
import chaifs from 'chai-fs';
import * as fs from 'fs';
import { jsonReader, jsonWriter } from '../util.js';

chai.use(chaifs);

describe('jsonReader(filePath)', () => {
    it('extracts data from json files', () => {
        const data = jsonReader('./test/json_reader_test.json');
        expect(data).to.eql([{ title: 'book1', author: 'author1', publisher: 'publisher1' }]);
    });
});

describe('jsonWriter(filePath, data)', () => {
    afterEach(() => {
        fs.unlinkSync('./test/json_writer_test.json');
    });
    const newBook1 = { title: 'book1', author: 'author1', publisher: 'publisher1' };
    const newBook2 = { title: 'book2', author: 'author2', publisher: 'publisher2' };

    it("creates a new file if one doesn't exist", () => {
        expect('./test/json_writer_test.json').to.not.be.a.path();
        jsonWriter('./test/json_writer_test.json', newBook1);
        expect('./test/json_writer_test.json').to.be.a.file();
    });
    it('writes data to json file', () => {
        jsonWriter('./test/json_writer_test.json', newBook2);
        const data = jsonReader('./test/json_writer_test.json');
        expect(data).to.eql(newBook2);
    });
});
