# About

Book finder is a command line application written in Node.js. It allows you to search the Google Books API and save books to a local JSON reading list.

# Before you start!

Before running the program, you must set your `API_KEY` in the terminal.

```
export API_KEY=<YOUR API KEY>
```
and then ```npm install``` to install the axios and chalk dependencies. 

If you already have a Google Books API key, you can skip the next section.

# Getting an API key

Google API keys are easy to get! You can sign in to the Google cloud platform with your Google account [here](https://console.cloud.google.com/apis/dashboard).
From there, create a new project, and then go to the API and Services page. Search for Google Books, click on it, then click ENABLE. After you have your API key, save it to your terminal as shown above.

More information can be found [here](https://support.google.com/googleapi/answer/6158841?hl=en).

# How to navigate program

To start the program, `cd` into the programs main directory and type `node book_finder.js` into the terminal.

After that, you can type in one of the following 5 commands:

-   `help` : Brings up the list of commands
-   `search ____` : Searches the Google Books API for books matching your search term. Ex: `search puppies` will return 5 books about puppies.
-   `save ___` : Saves a book to your reading list. Ex: `save 2` will save the second book from your previous search.
-   `view` : Shows you your saved Reading List.
-   `quit` : Exits the program.

# Sources/Technologies

I used the following modules in this project:

-   [Axios](https://github.com/axios/axios): Used to make the API calls to Google. 
-   [Chalk](https://github.com/chalk/chalk): Used to colorize the terminal output.
