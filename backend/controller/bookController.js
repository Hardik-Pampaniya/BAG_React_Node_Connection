const { verifyToken } = require('../middleware/auth');
const db = require('../config/db')
const path = require('path');
const fs = require('fs')

const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const offset = (page - 1) * pageSize;

        // const query = 'SELECT book.*, author.author_name FROM book JOIN author ON book.author_id = author.author_id LIMIT ? OFFSET ?'; 
        // const [books] = await db.query(query, [pageSize, offset]);

        const query = `SELECT * FROM book LIMIT ? OFFSET ?`
        const [books] = await db.query(query, [pageSize, offset])

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
        const { title, description, published_year, quantity_available, author_id, genre_id } = req.body

        if (!title || !description || !published_year || !quantity_available || !author_id || !genre_id) {
            return res.status(409).send({
                message: "all fields are required!"
            })
        }

        const [existingBook] = await db.query(`SELECT * FROM book WHERE title = ?`, [title])
        if (existingBook.length > 0) {
            return res.status(409).send({
                message: "Book already exist!"
            })
        }

        const data = await db.query(`INSERT INTO book (title, description, published_year, quantity_available, author_id,genre_id) VALUES (?,?,?,?,?,?)`, [title, description, published_year, quantity_available, author_id, genre_id])

        if (!data) {
            return res.status(404).send({
                message: 'Error in INSERT query!'
            })
        }

        res.status(201).send({
            message: 'Record created!'
        })
    } catch (error) {
        console.log(error)
        res.send({
            message: 'error in addBook api!'
        })
    }
}

const updateBoook = async (req, res) => {
    try {

        const bookId = req.params.id
        if (!bookId) {
            return res.status(404).send({
                message: 'invalid id'
            })
        }

        const { title, description, published_year, quantity_available, author_id, genre_id } = req.body

        const [existingBook] = await db.query(`SELECT * FROM book WHERE title = ?`, [title])
        if (existingBook.length > 0) {
            return res.status(409).send({
                message: "Book already exist!"
            })
        }

        const data = db.query("UPDATE book SET title = ?, description = ?, published_year = ?, quantity_available = ?, author_id = ?, genre_id = ? WHERE book_id = ?", [title, description, published_year, quantity_available, author_id, genre_id, bookId])

        if (!data) {
            return res.status(500).send({
                message: 'error in update book data!'
            })
        }
        res.status(200).send({
            message: 'data updated!'
        })

    } catch (error) {
        console.log(error)
        res.send({
            message: 'error in updateBook api!'
        })
    }
}

const deleteBook = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.query(`DELETE FROM book WHERE book_id = ? AND author_id NOT IN (SELECT author_id FROM author WHERE author.author_id = book.author_id)`, [id]);

        if (result.rowCount === 0) {
            return res.status(400).send({ message: 'Cannot delete book because the associated author exists!' });
        }

        res.status(200).send({ message: `Book with ID ${id} deleted successfully!` });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error in deleteBook API!', error });
    }
};


const getBookById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.query(`SELECT * FROM book WHERE book_id = ?`, [id]);

        if (result.length === 0) {
            return res.status(404).send({
                message: 'No records found'
            });
        }

        const data = result[0]; // the first element

        res.status(200).send({
            message: "Data fetched!",
            data: data
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error in get books by id API!',
            error: error.message
        }
        );
    }
}

const getImage = async (req, res) => {
    try {
        console.log(req.files)
        let id = req.params.id  
        let image = req.files.image //key and auth


        // if(image.length>1){
        //     throw new error('multiple file not allowed!')
        // }

       
         const dirExists = fs.existsSync(`public/assets/`);
        
        if (!dirExists) {
            fs.mkdirSync(`public/assets/`, { recursive: true });
        }

        if (image == undefined || image == null) throw new Error("file not found!");

       // let savePath = `/public/assets/${Date.now()}.${image.name.split(".").pop()}`


       
       let savePath = `/public/assets/${Date.now()}.${image.name.split(".").pop()}`
        image.mv(path.join(__dirname, ".." + savePath), async (err) => {
            if (err) throw new Error("error in uploading")

            else {
                const updateQuery = 'UPDATE book SET image = ? WHERE book_id = ?'
                await db.query(updateQuery, [savePath, id]);
                res.status(201).send({
                    message: 'file uploaded!'
                })
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error in file upload api!' });
    }
}

module.exports = { getAllBooks, addBook, updateBoook, deleteBook, getBookById,getImage }