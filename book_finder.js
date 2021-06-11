const { default: axios } = require('axios');

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

    console.log(response.data.items);
};
fetchBooks('puppy');
