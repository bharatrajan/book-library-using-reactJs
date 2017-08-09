var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var cors = require("cors");
var fs = require("fs");
var Promise = require("promise");


var fullBookList;

//Promisification
var readFile = Promise.denodeify(fs.readFile);
readFile("full_book_list.json", "utf8")
  .then(function (str) {
    fullBookList = JSON.parse(str);
  });

//Static content rendering
app.use(express.static("./build"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//SERVER SETUP
//CORS resolution
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "accept, content-type, xrs-tenant-id");
  next();
});

//GetBooks calls
app.get("/api/books",function(req, res){
  try{
    res.status(200);
    res.json({
      books : fullBookList.books.filter(function(book){
        return book.shelf !== "none";
      })
    });
  }catch(e){
    res.status(500);
    res.json({"error" : e});
  }
});

//Request handling
app.put("/api/books/:booksId",function(req, res){
  var i = 0;
  try{
    for(i=0; i<fullBookList.books.length; i++)
      if(fullBookList.books[i].id == req.params.booksId){
        fullBookList.books[i].shelf = req.body.shelf;
        res.json({book : fullBookList.books[i]});
        break;
      }
    res.status(200);
  }catch(e){
    res.status(500);
    res.json({"error" : e});
  }
});

//Search calls
app.post("/api/search",function(req, res){

  if(!req.body.query){
    res.status(200);
    res.json({"books" : []});
    return;
  }


  try{
    res.status(200);
    res.json({
      books : fullBookList.books.filter(function(book){
        var title = book.title.toLocaleLowerCase(),
          query = req.body.query.toLocaleLowerCase();
        return title.indexOf(query) > 1;
      })
    });
  }catch(e){
    res.status(500);
    res.json({"error" : e});
  }
});

var port = process.env.PORT || 8080
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
