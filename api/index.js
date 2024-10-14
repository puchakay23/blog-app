const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const multer = require('multer')
const fs = require("fs")
const upload = multer({ dest: 'uploads/' })

const User = require("./models/User")
const Post = require("./models/Post")

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:5174" }))
app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(__dirname + "/uploads"))

const secret = 'rishi'
app.listen(3000, () => {
    console.log("server started");
})

mongoose.connect('mongodb+srv://koushikrishi23:Rishi2304@cluster0.3osq8.mongodb.net/')

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password"
            })
        }
        const userDoc = await User.create({ username, password: hashedPassword })
        res.json(userDoc);
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body
    let userDoc = await User.findOne({ username })
    const passOk = await bcrypt.compare(password, userDoc.password)
    if (passOk) {
        //logged in
        const token = jwt.sign({ username, id: userDoc.id }, secret)
        res.cookie("token", token).json({
            id: userDoc._id,
            username
        })
    } else {
        res.status(400).json("wrong credentials")
    }
})

app.get("/profile", (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info)
    })
})

app.post("/logout", (req, res) => {
    res.cookie('token', "").json("ok")
})

app.post("/post", upload.single('file'), async (req, res) => {
    const { originalname, path } = req.file
    const parts = originalname.split(".")
    const ext = parts[parts.length - 1]
    const newPath = path + "." + ext
    fs.renameSync(path, newPath)

    const { token } = req.cookies
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id
        })
        res.json(postDoc)
    })
})

app.get("/posts", async (req, res) => {
    res.json(await Post.find())
})