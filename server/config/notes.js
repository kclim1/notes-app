const mongoose = require("mongoose");
const path = require('path')
const notes = require(path.join(__dirname, '..', 'config', 'notes'));


const notesSchema = new mongoose.Schema({
  user: {
    type : String,
    ref: "User",
    required: true
  },
  profileId : {
    type : String,
    ref : "User"
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: false
  }
}, { timestamps: true }); // Pass the timestamps option here

const Note = mongoose.model('Note', notesSchema);

module.exports = Note;

