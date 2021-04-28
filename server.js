// imports
const express = require("express")
const mongoose = require("mongoose")

// app config
const app = express();
const port = process.env.PORT || 9000

// middleware

// DB config
const connection__url = "mongodb+srv://rakibulWhatsApp:2YblJF8BY16GS9Pr@cluster0.dfncg.mongodb.net/whatsApp?retryWrites=true&w=majority"

mongoose.connect(connection__url, {
    useCreateIndex = true,
    useNewUrlParser = true,
    useUnifiedTopology = true
})

// api routers
app.get("/", (req, res) => {
    res.status(200).send("Hello world")
})

// listen
app.listen(port, () => console.log(`Listening on localhost: ${port}`,))