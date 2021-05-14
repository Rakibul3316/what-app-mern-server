// imports
import express from "express"
import mongoose from "mongoose"
import Messages from "./dbMessages.js"
import Pusher from 'pusher'
import cors from 'cors'

// app config
const app = express();
const port = process.env.PORT || 9000

// middleware
app.use(express.json());
app.use(cors())


// DB config
const connection__url = "mongodb+srv://rakibulWhatsApp:2YblJF8BY16GS9Pr@cluster0.dfncg.mongodb.net/whatsApp?retryWrites=true&w=majority"

const pusher = new Pusher({
    appId: "1196552",
    key: "1d744d3dbe10540ea6eb",
    secret: "45c71cf3d731b1c1f293",
    cluster: "mt1",
    useTLS: true
});

mongoose.connect(connection__url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.once("open", () => {
    console.log("DB connected.")

    const msgCollection = db.collection("chats");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log(change)

        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger('message', 'inserted',
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    received: messageDetails.received
                })

        } else {
            console.log("Error triggering pusher")
        }
    })
})



// api routers
app.get("/", (req, res) => {
    res.status(200).send("Hello world")
})

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessages = req.body;

    Messages.create(dbMessages, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// listen
app.listen(port, () => console.log(`Listening on localhost: ${port}`,))