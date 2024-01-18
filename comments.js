//Create web server
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//Read data from JSON file
let comments = JSON.parse(fs.readFileSync('./data/comments.json', 'utf-8'));

//Get all comments
app.get('/api/comments', (req, res) => {
    res.json(comments);
});

//Get a comment by id
app.get('/api/comments/:id', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(comment => comment.id === id);
    res.json(comment);
});

//Create a new comment
app.post('/api/comments', (req, res) => {
    const newComment = req.body;
    newComment.id = uuidv4();
    comments.push(newComment);
    fs.writeFileSync('./data/comments.json', JSON.stringify(comments));
    res.json(newComment);
});

//Delete a comment
app.delete('/api/comments/:id', (req, res) => {
    const { id } = req.params;
    comments = comments.filter(comment => comment.id !== id);
    fs.writeFileSync('./data/comments.json', JSON.stringify(comments));
    res.json({
        success: true,
        message: `Comment with id ${id} has been deleted`
    });
});

//Update a comment
app.put('/api/comments/:id', (req, res) => {
    const { id } = req.params;
    const newComment = req.body;
    comments = comments.map(comment => comment.id === id ? newComment : comment);
    fs.writeFileSync('./data/comments.json', JSON.stringify(comments));
    res.json(newComment);
});

//Start server
app.listen(port, () => console.log(`Server is listening on port ${port}`));