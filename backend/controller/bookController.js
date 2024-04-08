const mysqlpool = require('../config/db');
const path = require('path');
const fs = require('fs');

const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const offset = (page - 1) * pageSize;

        const [books] = await mysqlpool.query(`SELECT * FROM book LIMIT ? OFFSET ?`, [pageSize, offset]);

        if (!books || books.length === 0) {
            return res.status(404).send({
                message: 'No records found!'
            });
        }

        res.status(200).send({
            message: "Data fetched!",
            data: books
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error in getAllBooks API! ',
            error
        });
    }
};

const addBook = async (req, res) => {
    try {
        const { title, description, published_year, quantity_available, author_id, genre_id } = req.body;

        if (!title || !description || !published_year || !quantity_available || !author_id || !genre_id) {
            return res.status(409).send({
                message: "all fields are required!"
            });
        }

        const [existingBook] = await mysqlpool.query(`SELECT * FROM book WHERE title = ?`, [title]);
        if (existingBook.length > 0) {
            return res.status(409).send({
                message: "Book already exists!"
            });
        }

        await mysqlpool.query(`INSERT INTO book (title, description, published_year, quantity_available, author_id, genre_id) VALUES (?, ?, ?, ?, ?, ?)`, [title, description, published_year, quantity_available, author_id, genre_id]);

        res.status(201).send({
            message: 'Record created!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error in addBook API!'
        });
    }
};

const updateBook = async (req, res) => {
    const { book_id, title, description, published_year, quantity_available } = req.body;

    if (!book_id || !title || !description || !published_year || !quantity_available) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const [bookExists] = await mysqlpool.query(`SELECT book_id FROM book WHERE book_id = ?`, [book_id]);
        if (!bookExists.length) {
            return res.status(400).json({ message: "Book does not exist" });
        }

        await mysqlpool.query(`UPDATE book SET title = ?, description = ?, published_year = ?, quantity_available = ? WHERE book_id = ?`, [title, description, published_year, quantity_available, book_id]);

        return res.status(200).json({ message: "success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteBook = async (req, res) => {
    const { book_id } = req.params;
    try {
        const [bookExists] = await mysqlpool.query(`SELECT book_id FROM book WHERE book_id = ?`, [book_id]);

        if (!bookExists.length) {
            return res.status(400).json({ message: "Book does not exist" });
        }

        await mysqlpool.query(`DELETE FROM book WHERE book_id = ?`, [book_id]);

        return res.status(200).json({ message: "success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getBookById = async (req, res) => {
    try {
        const id = req.params.id;
        const [result] = await mysqlpool.query(`SELECT * FROM book WHERE book_id = ?`, [id]);

        if (result.length === 0) {
            return res.status(404).send({
                message: 'No records found'
            });
        }

        res.status(200).send({
            message: "Data fetched!",
            data: result[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error in get books by id API!',
            error: error.message
        });
    }
};

const getImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = req.files.image;

        const dirExists = fs.existsSync(`public/assets/`);
        if (!dirExists) {
            fs.mkdirSync(`public/assets/`, { recursive: true });
        }

        if (image == undefined || image == null) throw new Error("file not found!");

        const savePath = `/public/assets/${Date.now()}.${image.name.split(".").pop()}`;
        image.mv(path.join(__dirname, ".." + savePath), async (err) => {
            if (err) throw new Error("error in uploading");

            await mysqlpool.query(`UPDATE book SET image = ? WHERE book_id = ?`, [savePath, id]);

            res.status(201).send({
                message: 'file uploaded!'
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error in file upload api!' });
    }
};

module.exports = { getAllBooks, addBook, updateBook, deleteBook, getBookById, getImage };
