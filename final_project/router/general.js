const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


regd_users.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
      return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password }); // Benutzer hinzufügen
  console.log("Registered users:", users); // Debugging

  return res.status(201).json({ message: "User registered successfully" });
});





// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
      return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
      return res.status(404).send({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author);
  if (booksByAuthor.length > 0) {
      return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
      return res.status(404).send({ message: "No books found for the author" });
  }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title);
  if (booksByTitle.length > 0) {
      return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } else {
      return res.status(404).send({ message: "No books found for the title" });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
      return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
      return res.status(404).send({ message: "No reviews found for the book" });
  }
});


module.exports.general = public_users;
