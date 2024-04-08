const { verifyToken } = require('../middleware/auth');
const db = require('../config/db')
const mysqlpool = require('../config/db');

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

        if (!author_id || !author_name || !biography || !genre ) {
            return res.status(409).send({
                message: "all fields are required!"
            });
        }

        const [existingAuthor] = await mysqlpool.query(`SELECT * FROM author WHERE author_id = ?`, [author_id]);
        if (existingAuthor.length > 0) {
            return res.status(409).send({
                message: "Author already exists!"
            });
        }

        await mysqlpool.query(`INSERT INTO author (author_id, author_name, biography, genre) VALUES (?, ?, ?, ?, ?, ?)`, [author_id, author_name, biography, genre]);

        res.status(201).send({
            message: 'Record created!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error in addAuthor API!'
        });
    }
};
  
//update author
const updateAuthor = async (req, res) => {
    const { author_id, author_name, biography, genre} = req.body;

    if (!author_id || !author_name || !biography || !genre ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const [AuthorExists] = await mysqlpool.query(`SELECT author_id FROM author WHERE author_id = ?`, [author_id]);
        if (!AuthorExists.length) {
            return res.status(400).json({ message: "Author does not exist" });
        }

        await mysqlpool.query(`UPDATE author SET author_name = ?, biography = ?, genre = ? WHERE author_id = ?`, [author_name, biography, genre, author_id]);

        return res.status(200).json({ message: "success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//delete author
const deleteAuthor = async (req, res) => {
    const { author_id } = req.params;
    try {
        const [AuthorExists] = await mysqlpool.query(`SELECT author_id FROM author WHERE author_id = ?`, [author_id]);

        if (!AuthorExists.length) {
            return res.status(400).json({ message: "author does not exist" });
        }

        await mysqlpool.query(`DELETE FROM author WHERE author_id = ?`, [author_id]);

        return res.status(200).json({ message: "success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
module.exports = {getAllAuthors,addAuthor,updateAuthor,deleteAuthor}

