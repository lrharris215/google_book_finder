import { errorLog } from './util.js';

//Makes sure there is an API key before running the program
export const hasApiKey = (API_KEY) => {
    if (!API_KEY) {
        errorLog(
            "You must set your terminal's API_KEY before running this program. Please see the README for instructions."
        );
        return false;
    }
    return true;
};

//checks if the attempt to save is valid
export const isSaveValid = (input, fetchedBooks) => {
    const numberError = `You must enter a number between 1 and ${fetchedBooks.length} after the save command`;
    if (input.length !== 2) {
        errorLog('That is not a valid input');
        return false;
    } else if (fetchedBooks.length < 1) {
        errorLog("You haven't searched for any books yet! Try typing 'search' followed by a topic.");
        return false;
    } else if (isNaN(input[1])) {
        errorLog(numberError);
        return false;
    } else if (input[1] < 1 || input[1] > fetchedBooks.length) {
        errorLog(numberError);
        return false;
    }
    return true;
};

//Prevents users from just running 'search' with no query string
export const isSearchValid = (input) => {
    if (input.length < 1) {
        errorLog('You must enter a term to search!');
        return false;
    }
    return true;
};

//Checks to see if the book the user is attempting to save already exists on the reading list.
export const isNewBook = (library, book) => {
    for (let i = 0; i < library.length; i++) {
        let lbook = library[i];
        if (lbook.title === book.title && lbook.author === book.author && lbook.publisher === book.publisher) {
            return false;
        }
    }
    return true;
};
