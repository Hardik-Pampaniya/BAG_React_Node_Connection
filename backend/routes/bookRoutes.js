const { getAllAuthors, addAuthor, updateAuthor, deleteAuthor } = require("../controller/authorController");

const { getAllBooks, addBook, updateBoook, deleteBook, getBookById, getImage } = require("../controller/bookController");
const express = require('express');
const { searchBooksAndAuthors } = require("../controller/searchController");
const { checkLogin, addUser, getUser } = require("../controller/loginController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

//login
router.post('/login',checkLogin)

//adduser
router.post('/addUser',addUser)

router.get("/getUser", verifyToken, getUser)

//addauthot
router.post('/addAuthor', addAuthor);

//all user
router.get('/allBooks',verifyToken ,getAllBooks)

//add book 
router.post('/addBook',verifyToken,addBook)

//update book 
router.put('/updateBook/:id',verifyToken,updateBoook)

//image
router.post('/getImage/:id',verifyToken,getImage)

//get book by id
router.get('/getBookById/:id',getBookById)

//delete book
router.delete('/deleteBook/:id',verifyToken,deleteBook)

//get all authors
router.get('/allAuthors',verifyToken, getAllAuthors)

//add author
router.post('/addAuthor', verifyToken,addAuthor) 

//update author
router.put('/updateAuthor/:id',verifyToken,updateAuthor)

//delete author
router.delete('/deleteAuthor/:id',verifyToken,deleteAuthor)

//search
router.get('/search',verifyToken,searchBooksAndAuthors)

module.exports = router;