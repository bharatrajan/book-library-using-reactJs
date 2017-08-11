import React from 'react';
import {Route, Link} from 'react-router-dom';
import * as BooksAPI from './BooksAPI';

import BookSelf from './BookSelf.jsx';
import SearchView from './SearchView.jsx';

import './App.css';
import './fonts.css';

class BooksApp extends React.Component {

  //####### LOCAL PROPERTIES ###########
  state = {
    "responseStatus" : "", //Gets updated when server response
    "currentlyReading" : [],
    "wantToRead" : [],
    "read" : []
  }

  //############## LIFE CYCLE ###########
  /**
  * @description Make get all book during post mount
  * @type : life cycle
  * @returns none
  */
  componentDidMount = () => {
    this.getAllBooks();
  }

  //############ SERVER CALLS ###########
  /**
  * @description - Wrapper for BooksAPI.getAll server call
  * @param none
  * @returns none
  */
  getAllBooks = () => {
    BooksAPI.getAll().then(this.handleGetAllBooks);
  }

  /**
  * @description - Changing shelf invokes this method &
  * @description - Wrapper for BooksAPI.update server call
  * @description - Updates APP with new bookList
  * @param {object} book - Book thats getting updated
  * @param {string} newShelf - New shelf value
  * @returns none
  */
  updateShelf = (book, newShelf) => {
    if( book.shelf !== newShelf)
      BooksAPI.update(book, newShelf).then((itemizedBookList) => {

        //Update APP with new bookList
        if(itemizedBookList.currentlyReading
            && itemizedBookList.wantToRead
              && itemizedBookList.read)
                  this.getAllBooks();
      });
  }

  //############## HANDLERS #############
  /**
  * @description: Parse getAllBook response and sets status
  * @param: {object} response from getAllBook
  * @returns: null
  */
  handleGetAllBooks = (bookList) => {
    //User dont have any book
    if(bookList && typeof bookList.length === "number" && bookList.length === 0){
      this.setState({
        responseStatus: "ZERO_BOOKS"
      });
    }

    //User have atleast 1 book
    else if(bookList && typeof bookList.length === "number" && bookList.length !== 0){
      this.responseStatus = "NON_ZERO_BOOKS";
      this.setState({
        "responseStatus": "NON_ZERO_BOOKS",
        "read" : bookList.filter((book) => book.shelf === "read"),
        "wantToRead" : bookList.filter((book) => book.shelf === "wantToRead"),
        "currentlyReading" : bookList.filter((book) => book.shelf === "currentlyReading")
      });
    }

    //Undesired AJAX response
    else {
      this.setState({
        responseStatus: "ERROR"
      });
    }
    return null;
  }

  /**
  * @description: Template renderer
  * @param: None
  * @returns: None
  */
  render() {
    const {responseStatus, currentlyReading, wantToRead, read} = this.state;
    return (
      <div className="app" id="mainApp">

        <Route path="/" exact render={(history) => (

          <div className="list-books">
            <div className="list-books-title">
              <h1>LIBRARY</h1>
            </div>
            <div className="list-books-content">
                { //this.responseStatus is empty string before AJAX response
                  (responseStatus === "") &&
                  <div className="loading-text" name="errorScenario">
                      <span>Loading ...</span>
                  </div>
                }

                { //AJAX responded non-0 books returned
                  (responseStatus === "NON_ZERO_BOOKS") &&
                  <div>
                      <BookSelf
                        id="currentlyReadingBookSelf"
                        shelfTitle="Currently Reading"
                        onShelfChange={this.updateShelf}
                        bookList={currentlyReading} />
                      <BookSelf
                        id="wantToReadBookSelf"
                        shelfTitle="Want to Read"
                        onShelfChange={this.updateShelf}
                        bookList={wantToRead} />
                      <BookSelf
                        id="readBookSelf"
                        shelfTitle="Read"
                        onShelfChange={this.updateShelf}
                        bookList={read} />
                  </div>
                }

                { //AJAX responded 0 books returned
                  (responseStatus === "ZERO_BOOKS") &&
                  <div className="no-books-found" name="errorScenario">
                      <span>You have no books</span>
                      <span>Please add a book. Reading is good!</span>
                  </div>
                }

                { //AJAX responded 0 books returned
                  (responseStatus === "ERROR") &&
                  <div className="error-view" name="errorScenario">
                      <span>Something went wrong</span>
                      <span>Please check again later</span>
                  </div>
                }

            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>

        )} />

        <Route path="/search" exact render={(windowCtx) => (
          <SearchView
            updateShelf={(book, newShelf) => {
              this.updateShelf(book, newShelf);
              windowCtx.history.push("/");
            }}/>
        )} />

      </div>
    )
  }
}

export default BooksApp;
