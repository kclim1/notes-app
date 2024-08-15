const mongoose = require("mongoose");
const path = require('path')
const notes = require(path.join(__dirname, '..', 'config', 'notes'));


const notesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
}, { timestamps: true }); // Pass the timestamps option here

const Note = mongoose.model('Note', notesSchema);

module.exports = Note;

