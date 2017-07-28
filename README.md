## My Reads
This project contains the following functionalities
- 3 classifications of books
  - Continue Reading
  - Want to Read
  - Read
- User should be able to move a book from one category to other
- User should be able to remove a book by selecting none category
- An "Add" option that lets user to "Search" for popular books
- From the search results user can add a book to the above mentioned category
- From the search results user can add more than 1 book to the above mentioned category, by bulk selecting

## Component placement
```
    <BrowserRouter> <!-- From react-router-dom -->
      <BookApp>
        <Router> <!-- From react-router-dom -->
          <!-- Book listing -->
          <BookShelf> <!-- Category : Continue Reading -->
            <li><Book/></li>
            ...
            <li><Book/></li>
          </BookShelf>
          <BookShelf> <!-- Category : Want to read -->
            <li><Book/></li>
            ...
            <li><Book/></li>          
          </BookShelf>
          <BookShelf> <!-- Category : Read -->
            <li><Book/></li>
            ...
            <li><Book/></li>          
          </BookShelf>
        </Router>
        <Router>
          <SearchView>
            <!-- Search results -->
            <li><Book/></li>
            ...
            <li><Book/></li>
          </SearchView>
        </Router>
      </BookApp>
    </BrowserRouter>
```

## Imports
- react-router-dom :: For app routing
- fetch :: For making api calls

## Note
- If no book shows up, clear localStorage and reload the app

## Backend Server

To simplify your development process, we've provided a backend server for you to develop against. The provided file [`BooksAPI.js`](src/BooksAPI.js) contains the methods you will need to perform necessary operations on the backend:

### `getAll()`
* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* This collection represents the books currently in the bookshelves in your app.

### `update(book, shelf)`
* book: `<Object>` containing at minimum an `id` attribute
* shelf: `<String>` contains one of ["wantToRead", "currentlyReading", "read"]  
* Returns a Promise which resolves to a JSON object containing the response data of the POST request

### `search(query, maxResults)`
* query: `<String>`
* maxResults: `<Integer>` Due to the nature of the backend server, search results are capped at 20, even if this is set higher.
* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* These books do not know which shelf they are on. They are raw results only. You'll need to make sure that books have the correct state while on the search page.
