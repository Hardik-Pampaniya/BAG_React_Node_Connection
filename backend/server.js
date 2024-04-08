const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')

const path = require('path')

//env
const dotenv = require('dotenv');
const mysqlpool = require('./config/db');
const bodyParser = require('body-parser');
dotenv.config();


const PORT = process.env.PORT || 5000;




app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(cors({allowedHeaders:'*'}))
app.use('/public/profilePics/', express.static(path.join(__dirname, '/public/profilePics')))

app.use('/', require('./routes/bookRoutes'));


//testing route
app.get('/', (req, res) => {
    res.status(200).send('hello world');
})

mysqlpool.query('SELECT 1 + 1 AS solution')
    .then(() => {
        console.log('database connected')

        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`)
        });
    })
    .catch((err) => {
        console.log(err);
    });