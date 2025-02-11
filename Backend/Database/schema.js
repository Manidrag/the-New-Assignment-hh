//ramramji
//This file is used to create schema for the database and connect to the database

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://hhhh:ipass@cluster0.93ngq.mongodb.net/The_HHH', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const noteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  transcription: {
    type: String,
    ref: 'User'
  },
  favourite: {
    type: Boolean,
    default: false
  },
  image: {
    type: String, // Use Buffer to store binary data
    required: true
  },
  audio: {
    type: String, // Use Buffer to store binary data
    required: true
  },
  update: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);

module.exports = { User, Note };