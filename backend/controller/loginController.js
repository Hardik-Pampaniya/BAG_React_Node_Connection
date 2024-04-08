const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');


const generateToken = (user) => {
    const payload = { email: user.email, password: user.password, image: user.image };
    return jwt.sign(payload, 'crud', { expiresIn: '24h' });
};

const checkLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [existingUser] = await db.query('SELECT * FROM user WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            const user = existingUser[0];

            // Compare password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = generateToken(user);
                return res.status(200).send({ message: 'Login success!', token: token });
            } else {
                return res.status(401).send({ message: 'Incorrect password!' });
            }
        } else {
            return res.status(404).send({ message: 'Email not found! Sign up!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error in login check api!',
            error
        });
    }};

const addUser = async(req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password ) {
            return res.status(500).send({
                message: 'add all fields'
            })
        }

        const image = req.file.filename
       
        const [existingEmail] = await db.query('SELECT * FROM user WHERE email = ?', [email]);

        if (existingEmail.length > 0) {
            return res.status(409).send({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const data = await db.query("INSERT INTO user (email, password, image) VALUES (?, ?, ?)", [email, hashedPassword, image]);

        if (!data) {
            return res.status(404).send({
                message: 'error in INSERT query'
            })
        }

        res.status(201).send({
            message: 'record created!'
        })
        
    }catch(error){
        console.error(error); // Log the specific error
        return res.status(500).send({ message: error.message }); // Return the actual error message
    }
}


const getUser = (req, res) => {
        res.status(200).json({ message: "success", user: req.user });
      }



module.exports = { checkLogin, addUser, getUser };