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

// Handle get request for notes html page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Handle get API request
app.get('/api/notes', (req, res) => {
    console.log("Get request for ", req.path)
    let results = notes;
    console.log(notes)
    res.json(results)
})

// Handle post API request
app.post('/api/notes', (req, res) => {
    let newId = uniqid()
    req.body.id = newId

    console.log("Going to insert new note : ", req.body)

    // Append new note
    notes.push(req.body)

    res.json(notes[newId]);

    console.log("Notes after adding are ", notes);

    fs.writeFileSync(
        path.join(__dirname, 'data/db.json'),
        JSON.stringify(notes, null, 2)
    )
});

// Handle delete API request
app.delete('/api/notes/:id', (req, res) => {

    console.log("Going to delete Id : ", req.params.id)

    // Find the note by id for deletion and return error if not found
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

// Handle get wildcard request for invalid paths
app.get('*', (req, res) => {
    console.log("Get request for ", req.path)
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})