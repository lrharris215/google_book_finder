import axios from 'axios';

const APIKey = 'AIzaSyCRKpzT1nATS0sUG0LGw88GgdIedmOIRT4';

const url = 'https://www.googleapis.com/books/v1/volumes?q=';

const fetchBooks = async (searchTerm) => {
    const search = `${url}${searchTerm}&maxResults=5&key=${APIKey}`;
    let response;
    try {
        response = await axios({
            method: 'GET',
            url: search,
            headers: { Accept: 'application/json' },
        });
    } catch (err) {
        console.log(err);
        return;
    }

    const books = formatBooks(response.data.items);
    printBooks(books);
};

const formatBooks = (books) => {
    const formattedBooks = [];
    books.forEach((book) => {
        let newBook = {};
        newBook['title'] = book.volumeInfo.title;
        newBook['author'] = book.volumeInfo.authors[0];
        newBook['publisher'] = book.volumeInfo.publisher;
        formattedBooks.push(newBook);
    });
    return formattedBooks;
};

const printBooks = (books) => {
    books.forEach((book, idx) => {
        console.log(`#${idx + 1}: 
        title: ${book.title}
        author: ${book.author}
        publisher: ${book.publisher}`);
    });
};

fetchBooks('puppy');
