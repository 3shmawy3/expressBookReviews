const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // This array holds registered users

/**
 * Checks if a username is valid (not empty and not already taken).
 * @param {string} username - The username to check.
 * @returns {boolean} - True if the username is available and valid, false otherwise.
 */
const isValid = (username) => {
    // Check for null, undefined, or empty string
    if (!username || typeof username !== 'string' || username.trim() === '') {
        return false;
    }
    // Check if the username already exists in the users array
    const userMatches = users.filter((user) => user.username === username);
    return userMatches.length === 0; // Returns true if no matches found (i.e., user is valid/available)
}

/**
 * Checks if the provided username and password match a registered user.
 * NOTE: This is case-sensitive as per standard practice.
 * @param {string} username - The username to check.
 * @param {string} password - The password to check.
 * @returns {boolean} - True if the user is authenticated, false otherwise.
 */
const authenticatedUser = (username, password)=>{
    const matchingUsers = users.filter(
        (user) => user.username === username && user.password === password
    );
    return matchingUsers.length > 0;
}

// Task 7: Only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Error logging in: Username and password are required"});
    }

    if (authenticatedUser(username, password)) {
        // Generate JWT
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 }); // Use 'access' as the secret, matching the middleware in index.js

        // Save JWT and username to the session
        req.session.authorization = {
            accessToken,
            username
        }
        return res.status(200).send("User successfully logged in. Token saved to session.");
    } else {
        return res.status(401).json({message: "Invalid Login. Check username and password"});
    }
});

// Task 8: Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // Review content is passed via query parameter
    const username = req.session.authorization.username; // Get username from the session

    if (!books[isbn]) {
        return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
    }

    if (!review) {
        return res.status(400).json({message: "Review content is required."});
    }

    // Check if the book object has reviews, if not, initialize it (though booksdb.js should handle this)
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or modify the review using the username as the key
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: `Review for ISBN ${isbn} successfully added/modified by user ${username}.`,
        reviews: books[isbn].reviews
    });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Get username from the session

    if (!books[isbn]) {
        return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
    }

    const bookReviews = books[isbn].reviews;

    // Check if the user has a review to delete
    if (bookReviews && bookReviews[username]) {
        delete bookReviews[username];
        return res.status(200).json({
            message: `Review by user ${username} for ISBN ${isbn} successfully deleted.`,
            remainingReviews: bookReviews
        });
    } else {
        return res.status(404).json({message: `No review found by user ${username} for ISBN ${isbn}.`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
