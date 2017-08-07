import React from "react";
import Book from "./Book.jsx";
import PropsTypes from "prop-types";

export default class BookSelf extends React.Component {
  static PropsTypes = {
    shelfTitle: PropsTypes.string.isRequired,
    bookList: PropsTypes.array.isRequired
  };

  /**
  * @description: Template renderer
  * @param: None
  * @returns: None
  */
  render() {
    const { shelfTitle, bookList, onShelfChange, id } = this.props;
    return (
      <div className="bookshelf" id={"bookshelf=" + id}>
        {bookList.length !== 0 &&
          <div>
            <h2 className="bookshelf-title">
              {shelfTitle}
            </h2>
            <div className="bookshelf-books">
              <ol className="books-grid">
                {bookList.map(bookItem =>
                  <li id={bookItem.id} key={bookItem.id}>
                    <Book onShelfChange={onShelfChange} bookdata={bookItem} />
                  </li>
                )}
              </ol>
            </div>
          </div>}
      </div>
    );
  }
}
