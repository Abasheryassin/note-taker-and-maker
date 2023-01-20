const express = require('express');
const path = require('path');
const uniqid = require('uniqid');

const {readFromFile, readAndAppend, writeToFile} = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true} ));

app.use(express.static('public'));

app.get("*", (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

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
        res.json(`New note added`);
    }
});

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;

    readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((data) => {
        const newDataSet = data.filter((db) => db.id !== id);

        writeToFile('./db/db.json', newDataSet);

        res.json("Note has been deleted");
    })
})
app.listen(PORT, () => console.log(`Serving static asset routes at http://localhost:${PORT}`));