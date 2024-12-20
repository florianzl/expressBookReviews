const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Überprüfen, ob der Benutzername gültig ist
const isValid = (username) => {
  const existingUser = users.find(user => user.username === username);
  return !existingUser;
};

// Überprüfen, ob der Benutzer authentifiziert ist
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  console.log("Authentication check:", username, password, user); // Debugging
  return !!user; // Gibt true zurück, wenn der Benutzer gefunden wurde
};

// Benutzer registrieren
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

// Nur registrierte Benutzer können sich einloggen
regd_users.post("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
  req.session.token = token;

  console.log("Login successful for:", username); // Debugging
  return res.status(200).json({ message: "Login successful", token });
});

// Bewertung hinzufügen oder ändern
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Bewertung löschen
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found or book does not exist" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
