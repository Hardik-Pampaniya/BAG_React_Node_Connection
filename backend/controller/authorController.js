const { verifyToken } = require('../middleware/auth');
const db = require('../config/db')

const express = require('express')

//get all author
const getAllAuthors = async (req,res) => {
    try{

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5; 
        const offset = (page - 1) * pageSize;

        const query = `SELECT * FROM author LIMIT ? OFFSET ?`
        const [author] = await db.query(query,[pageSize,offset])

        if(!author){
            res.send(404).send({
                message: 'no records found!'
            })
        }
        res.status(200).send({
            message: 'data fetched!', 
            data: author
        })
    }catch(error){
        console.log(error)
        res.send({
            message: "error in get all author api!"
        })
    }
}

//add author
const addAuthor = async (req, res) => {
    try {
      const { author_id, author_name, biography, genre } = req.body;
    //   console.log(req.body);
  
      const existingAuthor = await Author.findOne({ author_id });

    //   console.log(existingAuthor);
  
      if (existingAuthor) {
        return res.status(400).json({ message: 'Author already exists' });
      }
    
  
      const newAuthor = new Author({
        author_id,
        author_name,
        biography,
        genre,
      });
  
      await newAuthor.save();
  
      res.status(200).json({ message: 'Author added successfully' });
    } catch (error) {
      console.error('Error adding author:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
//update author
const updateAuthor = async(req,res)=>{
    try {

        const authorId = req.params.id
        if (!authorId) {
            return res.status(404).send({
                message: 'invalid id'
            })
        }

        const { author_name,biography,genre } = req.body

        // const [existingAuthor] = await db.query(`SELECT * FROM author WHERE author_name = ?`, [author_name])
        // if (existingAuthor.length > 0) {
        //     return res.status(409).send({
        //         message: "Author already exist!"
        //     })
        // }

        const data = db.query("UPDATE author SET author_name = ?, biography = ?, genre = ? WHERE author_id = ?", [author_name, biography,genre,authorId])

        if (!data) {
            return res.status(500).send({
                message: 'error in update author data!'
            })
        }
        res.status(200).send({
            message: 'data updated!'
        })

    } catch (error) {
        console.log(error)
        res.send({
            message: 'error in updateAuthor api!'
        })
    }
}

//delete author
const deleteAuthor = async (req,res)=>{

        const authorId = req.params.id;
      
        // Check if there are any associated books for the author
        try {
            const authorId = req.params.id;
            
            if (!authorId) {
                return res.status(404).send({
                    message: 'Invalid ID'
                });
            }
        
            // Check if there are any associated books for the author
            const books = await db.query('SELECT * FROM book WHERE author_id = ?', [authorId]);
            if (books.length > 0) {
                return res.status(400).send({
                    message: 'Cannot delete author as there are associated books'
                });
            }
        
            // If no associated books, proceed with author deletion
            const data = await db.query('DELETE FROM author WHERE author_id = ?', [authorId]);
            if (!data) {
                return res.status(500).send({
                    message: 'Error in deleting author data'
                });
            }
        
            res.status(200).send({
                message: 'Author deleted successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'Error in deleteAuthor API'
            });
        }
        
    }
module.exports = {getAllAuthors,addAuthor,updateAuthor,deleteAuthor}

