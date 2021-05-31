//loading our tools
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//set storage engine
/**
 * below we set diskstorage and set its destination to our uploads folder under
 * public folder. our filename is set to the value of function
 * which takes 3 params req, file and a cb function
 * the cb function gets the filename and concatenates it with current date to make it unique
 * and not conflict with other files with the same name and lastly concatenates it with the extension
 * using path.extname(i.e hpeg , png , etc)
 */
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '_' + Date.now() + 
        path.extname(file.originalname));
    }
})


//initialize upload 
const upload = multer({
    storage: storage
}).single('myImage');


//init app 
const app = express();
const port = 3000;

//using ejs as view engine
app.set('view engine', 'ejs');

//public folder
app.use(express.static('./public'));

//loading route
app.get('/', (req, res)=> res.render('index'));

app.post('/upload', (req, res)=> {
    upload(req, res, (err)=>{
        if(err){
            res.render('index', {
                msg: err
            });
        } else{
            console.log(req.file)
            res.send('upload successful');
        }
    })
})

//starting server
app.listen(port, ()=> console.log(`Server running on port ${port}`));