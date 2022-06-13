const express = require('express')
const app = express()

const dotenv = require('dotenv')
const mongoose = require('mongoose')
const multer  = require('multer')

const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts")
const catsRoute = require("./routes/categories")

dotenv.config()
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/MyBlog',{
                                                    useNewUrlParser: true,
                                                    useUnifiedTopology: true
                                                }
            ).then(console.log('connected to mongodb'))
            .catch((err)=>console.log(err))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage')
    },
    filename: function (req, file, cb) {
        cb(null, "hello.jpg")
    }
})

const upload = multer({ storage: storage })

app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded!")
})

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/categories', catsRoute)

app.listen('5000', () => {
    console.log("backend is running")
})