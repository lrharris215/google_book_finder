import express from 'express';
import BookService from './book_service.js'

const app = express();
const port = 3001;

const { API_KEY } = process.env;

const readingListFilePath = './reading_list.json';

const bookService = new BookService(readingListFilePath, API_KEY);

app.get('/view', (req, res, next) => {
  let readingList;
  try {
      readingList = bookService.fetchReadingList();
      res.send(readingList);
  } catch (err) {
      next(err);
  }
})

app.get('/search', async (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  if (!searchTerm){
    res.send("Please enter a valid search term")
    return;
  }
  try {
    await bookService.fetchBooks(searchTerm);
    res.send(bookService.fetchedBooks)
  } catch(err) {
    next(err);
  }

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
