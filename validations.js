import { errorLog } from './util.js';

export const validateSave = (input, fetchedBooks) => {
    if (input.length < 2 || input.length > 2) {
        return false;
    } else if (isNaN(input[1])) {
        return false;
    } else if (input[1] < 1 || input[1] > 5) {
        return false;
    } else if (!fetchedBooks[input[1]]) {
        errorLog("You haven't searched for any books yet!");
        return false;
    }
    return true;
};

export const validateSearch = (input) => {
    if (input.length < 1) {
        errorLog('You must enter a term to search!');
        return false;
    }
    return true;
};
