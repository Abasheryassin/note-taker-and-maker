const express = require('express');
const path = require('path');
const uniqid = require('uniqid');

const {readFromFile, readAndAppend, writeToFile} = require('./helpers/fsUtils');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true} ));

app.use(express.static('public'));

app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get("/api/notes", (req, res) => {
    readFromFile("./db/db.json")
    .then((data) => {
        res.json(JSON.parse(data));
    });
});

app.post("/api/notes", (req, res) => {
    console.log(req.body);

    const {title , text} = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uniqid()
        }
        readAndAppend(newNote, "./db/db.json");
        res.json(`New note added`)
    }
});

app.listen(PORT, () => console.log(`Serving static asset routes at http://localhost:${PORT}`));