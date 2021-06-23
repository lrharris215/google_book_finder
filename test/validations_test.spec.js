import sinon from 'sinon';
import { expect } from 'chai';
import { hasApiKey } from '../validations.js';

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
