const express = require("express");
const asyncHandler = require("express-async-handler");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	//Write your code here
	const username = req.body.username;
	const password = req.body.password;

	//console.log(req.body);
	//console.log(username);
	//console.log(password);

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Both username and password are required" });
	}

	const userBool = users.find((user) => user.username === username);
	if (userBool) {
		return res.status(409).json({
			message:
				"Username has already been used. Try another username or sign in.",
		});
	}
	users.push({ username: username, password: password });

	return res.status(200).json({
		message: "Success",
		body: { username: username, password: password },
	});
});

const getBooks = function () {
	return books;
};

// Get the book list available in the shop
public_users.get(
	"/",
	asyncHandler(async (req, res) => {
		//Made fake getBooks() function to simulate a database call. Has no effect with a hardcoded fake db.
		try {
			const list = await getBooks();
			return res.send(JSON.stringify({ list }, null, 4));
		} catch (error) {
			return res.status(403).json({ error: error });
		}
	})
);

const getBookByISBN = function (index) {
	let bookObj = Object.values(books);
	let filtered_books = bookObj[index];
	return filtered_books;
};

// Get book details based on ISBN
public_users.get(
	"/isbn/:isbn",
	asyncHandler(async (req, res) => {
		const isbn = req.params.isbn;
		let index = isbn - 1;
		//Moved to separate function to simulate a database call
		//let bookObj = Object.values(books);
		//let filtered_books = bookObj[index];
		try {
			let filtered_books = await getBookByISBN(index);
			return res.send(JSON.stringify({ filtered_books }, null, 4));
		} catch (error) {
			return res.status(403).json({ error: error });
		}
	})
);

const getBooksByAuthor = function (author) {
	let bookObj = Object.values(books);
	let filtered_books = bookObj.filter((book) => book.author == author);
	return filtered_books;
};

// Get book details based on author
public_users.get(
	"/author/:author",
	asyncHandler(async (req, res) => {
		const author = req.params.author;
		//Moved to separate function to simulate a database call
		//let bookObj = Object.values(books);
		//let filtered_books = bookObj.filter((book) => book.author == author);
		try {
			let filtered_books = await getBooksByAuthor(author);
			return res.send(JSON.stringify({ filtered_books }, null, 4));
		} catch (error) {
			return res.status(403).json({ error: error });
		}
	})
);

const getBooksByTitle = function (title) {
	let bookObj = Object.values(books);
	let filtered_books = bookObj.filter((book) => book.title == title);
	return filtered_books;
};

// Get all books based on title
public_users.get(
	"/title/:title",
	asyncHandler(async (req, res) => {
		const title = req.params.title;
		//Moved to separate function to simulate a database call
		//let bookObj = Object.values(books);
		//let filtered_books = bookObj.filter((book) => book.title == title);

		try {
			let filtered_books = await getBooksByTitle(title);
			return res.send(JSON.stringify({ filtered_books }, null, 4));
		} catch (error) {
			return res.status(403).json({ error: error });
		}
	})
);

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	//Write your code here
	const isbn = req.params.isbn;
	let index = isbn - 1;
	let bookObj = Object.values(books);
	let filtered_books = bookObj[index];
	let reviews = filtered_books.reviews;
	return res.send(JSON.stringify({ reviews }, null, 4));
});

module.exports.general = public_users;
