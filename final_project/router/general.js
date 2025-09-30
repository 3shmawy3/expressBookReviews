const express = require('express');
let books = require("./booksdb.js");
// Import the isValid helper function and the users array from auth_users.js
// Note: We need to import isValid and users to support the /register route (Task 6)
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Task 6: Complete the code for registering a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Registration failed. Username and password are required."});
    }

    // Check validity using the imported isValid function
    if (isValid(usernameconst express = require('express');
    let books = require("./booksdb.js");
    let isValid = require("./auth_users.js").isValid;
    let users = require("./auth_users.js").users;
    const public_users = express.Router();
    
    /**
     * Helper function to simulate an asynchronous call to retrieve the books object.
     * Returns a Promise that resolves with the books data after a small delay.
     */
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            // Simulate a small delay for asynchronous behavior
            setTimeout(() => {
                if (books) {
                    resolve(books);
                } else {
                    reject({ message: "No books available" });
                }
            }, 50); 
        });
    };
    
    // Task 6: Complete the code for registering a new user (Synchronous)
    public_users.post("/register", (req,res) => {
        const username = req.body.username;
        const password = req.body.password;
    
        if (!username || !password) {
            return res.status(400).json({message: "Registration failed. Username and password are required."});
        }
    
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login."});
        } else {
            return res.status(409).json({message: "Registration failed. Username already exists or is invalid."});
        }
    });
    
    
    // Task 10: Get the book list available in the shop (using Async/Await)
    public_users.get('/', async function (req, res) {
        try {
            // Await the result from the simulated asynchronous data retrieval
            const bookList = await getBooks();
            
            // Use JSON.stringify for neat output
            return res.status(200).send(JSON.stringify(bookList, null, 4));
        } catch (error) {
            return res.status(500).json({ message: "Error fetching book list." });
        }
    });
    
    
    // Task 11: Get book details based on ISBN (using Promise Callbacks .then())
    public_users.get('/isbn/:isbn', function (req, res) {
        const isbn = req.params.isbn;
        
        // Call the asynchronous function and use .then() to handle the result
        getBooks()
            .then(bookList => {
                if (bookList[isbn]) {
                    return res.status(200).json(bookList[isbn]);
                } else {
                    return res.status(404).json({ message: "Book not found for ISBN " + isbn });
                }
            })
            .catch(error => res.status(500).json({ message: "Error fetching book details." }));
    });
    
    
    // Task 12: Get book details based on author (using Async/Await)
    public_users.get('/author/:author', async function (req, res) {
        const searchAuthor = req.params.author.toLowerCase();
        
        try {
            // Await the asynchronous data retrieval
            const bookList = await getBooks();
            const matchingBooks = {};
            
            for (const key in bookList) {
                if (bookList.hasOwnProperty(key) && bookList[key].author.toLowerCase() === searchAuthor) {
                    matchingBooks[key] = bookList[key];
                }
            }
            
            if (Object.keys(matchingBooks).length > 0) {
                return res.status(200).json(matchingBooks);
            } else {
                return res.status(404).json({ message: "No books found by author " + req.params.author });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error fetching book list." });
        }
    });
    
    
    // Task 13: Get all books based on title (using Promise Callbacks .then())
    public_users.get('/title/:title', function (req, res) {
        const searchTitle = req.params.title.toLowerCase();
        
        // Call the asynchronous function and use .then() to handle the result
        getBooks()
            .then(bookList => {
                const matchingBooks = {};
                
                for (const key in bookList) {
                    if (bookList.hasOwnProperty(key) && bookList[key].title.toLowerCase() === searchTitle) {
                        matchingBooks[key] = bookList[key];
                    }
                }
    
                if (Object.keys(matchingBooks).length > 0) {
                    return res.status(200).json(matchingBooks);
                } else {
                    return res.status(404).json({ message: "No books found with title " + req.params.title });
                }
            })
            .catch(error => res.status(500).json({ message: "Error fetching book list." }));
    });
    
    
    // Task 5: Get book review (Synchronous - unchanged)
    public_users.get('/review/:isbn',function (req, res) {
        const isbn = req.params.isbn;
        const book = books[isbn];
    
        if (book) {
            // Reviews are an object inside the book details
            const reviews = book.reviews;
            return res.status(200).json(reviews);
        } else {
            return res.status(404).json({message: "Book not found for ISBN " + isbn});
        }
    });
    
    module.exports.general = public_users;
    )) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login."});
    } else {
        // If isValid returns false, it means the username is either empty/invalid or already exists
        return res.status(409).json({message: "Registration failed. Username already exists or is invalid."});
    }
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Implementation for Task 1: Use JSON.stringify for neat output as per the hint
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found for ISBN " + isbn});
    }
});
 
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const searchAuthor = req.params.author.toLowerCase();
    const matchingBooks = {};
    const bookKeys = Object.keys(books);

    for (const key of bookKeys) {
        if (books[key].author.toLowerCase() === searchAuthor) {
            matchingBooks[key] = books[key];
        }
    }

    if (Object.keys(matchingBooks).length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({message: "No books found by author " + req.params.author});
    }
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const searchTitle = req.params.title.toLowerCase();
    const matchingBooks = {};
    const bookKeys = Object.keys(books);

    for (const key of bookKeys) {
        if (books[key].title.toLowerCase() === searchTitle) {
            matchingBooks[key] = books[key];
        }
    }

    if (Object.keys(matchingBooks).length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({message: "No books found with title " + req.params.title});
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        // Reviews are an object inside the book details
        const reviews = book.reviews;
        return res.status(200).json(reviews);
    } else {
        return res.status(404).json({message: "Book not found for ISBN " + isbn});
    }
});

module.exports.general = public_users;
