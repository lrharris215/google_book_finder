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
    it('writes data to json file');
    it("creates a new file if one doesn't exist");
});
