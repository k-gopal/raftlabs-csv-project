const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csvRoute = require('./routes/csv');

const app = express();
let PORT = 8000;

// getting data in JSON format
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//using cookie parser
app.use(cookieParser());

//Setting up cors
var corsOption = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// using routes
app.use('/csv', csvRoute);

// listening app on portauth
app.listen(PORT, () => {
    console.log('Post App listening on port: ', PORT);
});