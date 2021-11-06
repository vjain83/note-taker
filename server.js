const fs = require('fs');
const path = require('path');
const express = require('express');
var uniqid = require('uniqid');
const app = express();
const PORT = process.env.PORT || 3001;
const notes = require('./data/db.json');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results)
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.post('/api/notes', (req, res) => {
    let newId = uniqid()
    req.body.id = newId

    console.log("Going to insert new note : ", req.body)

    notes.push(req.body)

    res.json(notes[newId]);

    console.log("Notes after adding are ", notes);

    fs.writeFileSync(
        path.join(__dirname, 'data/db.json'),
        JSON.stringify(notes, null, 2)
    )
});

app.delete('/api/notes/:id', (req, res) => {

    console.log("Going to delete Id : ", req.params.id)

    const note = notes.find(n => n.id == req.params.id)
    if (!note) return res.status(404).send(`Id ${req.params.id} not found`)

    const index = notes.indexOf(note)
    notes.splice(index, 1)

    res.json(note);

    console.log("Notes after deleting are ", notes);

    fs.writeFileSync(
        path.join(__dirname, 'data/db.json'),
        JSON.stringify(notes, null, 2)
    )
});

app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
})