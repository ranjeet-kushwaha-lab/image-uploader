import express from 'express'
import mongoose from 'mongoose';
import multer from 'multer'
import path from 'path';
import "dotenv/config"
const url = process.env.API_Url;

import dns from 'dns'
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// cloudinary import $ configuration code.
import { v2 as cloudinary } from 'cloudinary';
// configuration.
cloudinary.config({
    cloud_name: 'owsvznhl',
    api_key: '651882664451521',
    api_secret: 'k4qGAfwpBs05e8q4RrS2AX0syxc'
});

mongoose.connect(
    url, {
    dbName: "nodejs_course",
}).then(() => console.log('mongoDB connected..!')).catch((err) => console.log(err))

// rendering ejs file.
app.get('/', (req, res) => {
    res.render('index.ejs', { url: null })
})

// diskstorage.
const storage = multer.diskStorage({
    // destination: '.public/uploads',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname)
        cb(null, file.fieldname + "-" + uniqueSuffix)
    },
});


const upload = multer({ storage: storage })

//mongoDB schema.
const imageSchema = new mongoose.Schema({
    filename: String,
    public_id: String,
    imgUrl: String
});

const File = mongoose.model("cloudinary", imageSchema)

// for uploading file.
app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file.path
    const cloudinaryRes = await cloudinary.uploader.upload(file, {
        folder: "nodejs_course"
    });

    // save to database.
    const db = await File.create({
        filename: file.originalname,
        public_id: cloudinaryRes.public_id,
        imgUrl: cloudinaryRes.secure_url
    });
    res.render("index.ejs", { url: cloudinaryRes.secure_url })

    // res.json({ message: "file uploaded sucessfully", cloudinaryRes })
})

// server port.
const port = 3000;
app.listen(port, () => console.log(`server is running on port ${port}`));