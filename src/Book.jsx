import React, { Component } from "react";
import PropsTypes from "prop-types";

class Book extends Component {
  /**
  * @description - Set props to parent
  * @description - Binds "this" inside "onCatagoryChange"
  * @constructor
  * @param {object} props - attributes sent from parent
  * @returns none
  */
  constructor(props) {
    super(props);

    //Binds "this" inside "onCatagoryChange"
    this.onCatagoryChange = this.onCatagoryChange.bind(this);
  }

  //####### LOCAL PROPERTIES ###########
  static PropsTypes = {
    bookdata: PropsTypes.object.isRequired
  };

  state = {
    selectStatus: "UNSELECTED"
  };

  //############# HANDLERS #############
  /**
  * @description - Invoked when user changes the shelf w/ dropdown
  * @description - Calls parent's "onShelfChange" event
  * @eventListener
  * @param {object} event - on change event from dropdown
  * @returns none
  */
  onCatagoryChange = event => {
    event.stopPropagation();
    event.preventDefault();
    this.props.onShelfChange(this.props.bookdata, event.target.value);
  };

  /**
  * @description - Parent should set "isMultiSelectable" to true & send onSelect callback props
  * @description - 1) Toggles status of the book from unselected -> selected & viseversa.
  * @description - 2) Calls parent's onSelect function
  * @eventListener
  * @param {object} event - on click event from book
  * @returns none
  */
  _handleOnClick = event => {
    if (!this.props.isMultiSelectable) return;

    const newStatus =
      this.state.selectStatus === "SELECTED" ? "UNSELECTED" : "SELECTED";
    this.props.onSelect(this.props.bookdata, this.props.bookdata.id, newStatus);
    this.setState({ selectStatus: newStatus });
  };

  /**
  * @description: Template renderer
  * @param: None
  * @returns: None
  */
  render() {
    //Storing bookdata into a contant
    const { bookdata } = this.props;

    //Prepare AuthorList
    let authorList = "";
    if (
      bookdata &&
      bookdata.authors &&
      bookdata.authors.length &&
      bookdata.authors.length > 0
    )
      authorList = bookdata.authors.join(", ");

    //Prepare Image Link
    let imageLink = "";
    if (bookdata && bookdata.imageLinks && bookdata.imageLinks.thumbnail)
      imageLink = `url('${bookdata.imageLinks.thumbnail}')`;

    //Template
    return (
      <div className="book" id={"book-" + bookdata.id}>
        <div className={`book-top ${this.state.selectStatus}`}>
          <div
            className="book-cover"
            onClick={this._handleOnClick}
            style={{
              width: 128,
              height: 193,
              backgroundImage: imageLink
            }}
          />
          <div className="book-shelf-changer">
            <select
              onChange={this.onCatagoryChange}
              defaultValue={bookdata.shelf || "none"}
            >
              <option value="none" disabled>
                Move to...
              </option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">
          {bookdata.title || ""}
        </div>
        <div className="book-authors">
          {authorList}
        </div>
      </div>
    );
  }
}

export default Book;
