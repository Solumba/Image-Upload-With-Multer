//
const express = require('express');
const multer = require('multer');
const eje = require('ejs');
const path = require('path');

//init app 
const app = express();
const port = 3000;

//using ejs as view engine
app.set('view engine', 'ejs');

//public folder
app.use(express.static('./public'));

//loading route
app.get('/', (req, res)=> res.render('index'));

//starting server
app.listen(port, ()=> console.log(`Server running on port ${port}`));