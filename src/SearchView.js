import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import * as BooksAPI from './BooksAPI';

import Book from './Book.js';

class SearchView extends Component {

  //####### LOCAL PROPERTIES ###########
  state = {
    bookList: [],
    selectedBookList: {}
  }
  searchSuggetionStr = "Android, Art, Artificial Intelligence, Astronomy, " +
                       "Austen, Baseball, Basketball, Bhagat, Biography, Brief, " +
                       "Business, Camus, Cervantes, Christie, Classics, Comics, Cook, " +
                       "Cricket, Cycling, Desai, Design, Development, Digital Marketing, Drama, " +
                       "Drawing, Dumas, Education, Everything, Fantasy, Film, Finance, First, Fitness, Football, " +
                       "Future, Games, Gandhi, History, History, Homer, Horror, Hugo, Ibsen, Journey, " +
                       "Kafka, King, Lahiri, Larsson, Learn, Literary Fiction, Make, Manage, Marquez, " +
                       "Money, Mystery, Negotiate, Painting, Philosophy, Photography, Poetry, Production," +
                       "Program Javascript, Programming, React, Redux, River, Robotics, Rowling, Satire, " +
                       "Science Fiction, Shakespeare, Singh, Swimming, Tale, Thrun, Time, Tolstoy, " +
                       "Travel, Ultimate, Virtual Reality, Web Development, iOS";

  //############ SERVER CALLS ###########
  /**
  * @description - Search for backend w/ query="event.target.value"
  * @description - onSuccess: Update state w/ responded booklist
  * @description - onError: Resets state
  * @param {object} event - on change event from <input>
  * @returns none
  */
  searchBookAJAX = (event) => {
    BooksAPI.search(event.target.value, 1000).then((bookList) => {
        (bookList &&
         bookList.length &&
         bookList.length > 0) ?
            this.setState({bookList}) : //SUCCESS: Update state
            this.setState({ bookList:[] }); //ERROR: Reset state;
    });
  }

  /**
  * @description - Called when user hits any of 3 buttons
  * @description - Moves shelf for all the books inside `state.selectedBookList`
  * @param {String} newShelf - new value of the shelf
  * @returns none
  */
  _moveSelectedBooksTo = (newShelf) => {
    var selectedBookIdArr = Object.keys(this.state.selectedBookList);
    if( selectedBookIdArr.length !== 0 ){
        selectedBookIdArr.forEach((bookId) =>
              this.props.updateShelf(this.state.selectedBookList[bookId], newShelf));
    }else {
      alert("Please select atleast 1 book");
    }
  }

  /**
  * @description - Called inside shild "Book" component
  * @description - Called when a book is selected | unselected
  * @description - Redirects tp bookUNSELECTED | bookSELECTED method
  * @param {Object} bookData - Book object thats selected | unselected
  * @param {String} bookId - Id of book thats selected | unselected
  * @param {String} status - selected | unselected
  * @returns none
  */
  _handleMultiSelect = (bookData, bookId, status) => {
    this["book" + status](bookId, bookData);
  }

  /**
  * @description - Removes the book from `state.selectedBookList`
  * @param {String} bookId - Id of book thats unselected
  * @returns none
  */
  bookUNSELECTED = (bookId) => {
    this.setState((prevState) => {
      prevState.selectedBookList[bookId] = undefined;
      return {selectedBookList : prevState.selectedBookList} ;
    });
  }

  /**
  * @description - Adds the book into `state.selectedBookList`
  * @param {Object} bookData - Book object thats selected
  * @param {String} bookId - Id of book thats unselected
  * @returns none
  */
  bookSELECTED = (bookId, bookData) => {
    this.setState((prevState) => {
      prevState.selectedBookList[bookId] = bookData;
      return {selectedBookList : prevState.selectedBookList} ;
    });
  }

  /**
  * @description: Decide if render() should be called or not
  * @description: For better performance, we dont need to call render()
  * @description: whenever `state.selectedBookList` is updated
  * @param: {Object} nextProps - new set of props
  * @param: {Object} nextState - new set of state
  * @returns: {Boolean} Decision to call render() or not
  */
  shouldComponentUpdate = (nextProps, nextState) => {
    return( this.state.bookList !== nextState.bookList);
  }

  /**
  * @description: Template renderer
  * @param: None
  * @returns: None
  */
  render(){
    //Storing data locally
    const {bookList} = this.state;

    //Null check and return
    if(bookList.error) return null;

    //Template
    return(
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              onChange={this.searchBookAJAX}
              placeholder="Search by title or author"/>
          </div>
        </div>

        {bookList.length === 0 && (
          <div className="search-suggestions">
            <span> Popular search terms are . . .
                   <br/>
                   {this.searchSuggetionStr} </span>
          </div>
        )}

        {bookList.length !== 0 && (
          <div className="bulk-update">
            <div className="bulk-update-option"
                 onClick={()=> this._moveSelectedBooksTo("currentlyReading")}>
              <span className="add-to">Add to . . .</span>
              <span>Continue Reading</span>
            </div>
            <div className="bulk-update-option"
                 onClick={()=> this._moveSelectedBooksTo("wantToRead")}>
              <span className="add-to">Add to . . .</span>
              <span>Want to Read</span>
            </div>
            <div className="bulk-update-option"
                 onClick={()=> this._moveSelectedBooksTo("read")}>
              <span className="add-to">Add to . . .</span>
              <span>Read</span>
            </div>
          </div>
        )}

        <div className="search-books-results">
          <ol className="books-grid">
            {bookList.length !== 0 && (
              this.state.bookList.map((bookItem) =>
                <li id={bookItem.id} key={bookItem.id}>
                    <Book
                      bookdata={bookItem}
                      isMultiSelectable={true}
                      onSelect={this._handleMultiSelect}
                      onShelfChange={this.props.updateShelf}
                    />
                </li>
              )
            )}
          </ol>
        </div>

        {/*
          <div className="alert-box-container align-center">
          <div className="alert-box">
            <div className="alert-message align-center">
             Please select atleast 1 book
            </div>
            <div className="user-response">
              OK
            </div>
          </div>
        </div>*/}
      </div>
    )
  }

}

export default SearchView;
