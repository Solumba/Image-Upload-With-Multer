//loading our tools
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//set storage engine
/**
 * The CB here is an input call back function
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
/**
 * Here, we use our storage fuction setup while we initialize our upload.
 * our multer takes an object and we set the strogae property to our storage function.
 * single('myImage') indicates we expect to receive a single file from the field 'myImage'
 * limits allows us to set and limit certain file uploads for example,files that are above
 * a certain size like you see on websites.
 */
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 4000000,
    },
    fileFilter: (req, file, cb)=>{
        checkFileType(file,cb)
    }
}).single('myImage');

/**
 * The function below takes our file and compares its mimetype 
 * and file format(originalname) to the regex we have set and allows
 * it to be uploaded if there is a match or an error if it is not 
 */
function checkFileType(file, cb){
    //file types to test with the filename
    const fileTypes = /jpeg|jpg|png|gif/;

    //testing it with the file original name  this will return a value if it is true
    const extensionName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

    //testing the file type with the file mime type  this will return a value if it is true
    const mimeType = fileTypes.test(file.mimetype);

    //check if extension name and mime type re true i.e if they have a value

    if(extensionName && mimeType){
        //return our multer cb with two params(null and true)
        return cb(null, true)
    }else{
        //this custom error would later be passed on to msg
        cb(`images only`)
    }
}



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
            if(req.file == undefined){
                res.render('index', {
                    msg: 'please select an image'
                });
            }else{
                setTimeout(() => {
                    res.render('index', {
                        msg: 'file uploaded successfully',
                        //send in our actual file to be displayed in an image tag on the page
                        file: `/uploads/${req.file.filename}`
                    });
                }, 5000);
            }
        }
    })
})

//starting server
app.listen(port, ()=> console.log(`Server running on port http://localhost:${port}`));