const { getAllAuthors, addAuthor, updateAuthor, deleteAuthor } = require("../controller/authorController");

const { getAllBooks, addBook, updateBook, deleteBook, getBookById, getImage } = require("../controller/bookController");
const express = require('express');
const { searchBooksAndAuthors } = require("../controller/searchController");
const { checkLogin, addUser, getUser } = require("../controller/loginController");
const { verifyToken } = require("../middleware/auth");
const fileHandleMiddleware = require("../middleware/fileHandleMiddleware");

const router = express.Router();

//login
router.post('/login',checkLogin)

//adduser
router.post('/addUser',fileHandleMiddleware.single("image"), addUser)


router.get("/getUser", verifyToken, getUser)

//addauthot
router.post('/addAuthor', addAuthor);

//all user
router.get('/allBooks',verifyToken ,getAllBooks)


//get Profile

router.get("/profile", verifyToken, (req, res)=>{
    const user = req.user
    if(user){
        res.status(200).json({success: "true", user: user})
    }
})

//add book 
router.post('/addBook',verifyToken,addBook)

//update book 
router.put('/updateBook/:book_id' , updateBook);


//image
router.post('/getImage/:id',verifyToken,getImage)

//get book by id
router.get('/getBookById/:id',getBookById)

//delete book
router.delete('/deleteBook/:book_id', deleteBook);

//get all authors
router.get('/allAuthors',verifyToken, getAllAuthors)

//add author
router.post('/addAuthor', verifyToken,addAuthor) 

//update author
router.put('/updateAuthor/:author_id',updateAuthor)

//delete author
router.delete('/deleteAuthor/:id',verifyToken,deleteAuthor)

//search
router.get('/search',verifyToken,searchBooksAndAuthors)

module.exports = router;