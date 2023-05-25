var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");


mongoose.connect(process.env.DB);

var app = express(); // creates express server
app.use(cors()); // allows the browser to make a call to the server
app.use(bodyParser.json()); // removes the need to manually parse objects
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());




// Movie schema - used to create instances of 'Movie' that we can utilize in
// retrieving/updating/deleting/posting new movies to the db
var MovieSchema = new Schema({
    title: { // Title is simply a string separated by spaces (REQUIRED)
        type: String,
        required: true,
        index: true
    },
    releaseDate: { // Release date is an int (REQUIRED)
        type: Number,
        required: true
    },
    genre: { // Genre is a string, but no spaces/multiple genres are accepted (REQUIRED)
        type: String,
        enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'],
        required: true
    },
    actors: [ // Actors is an array of strings which can hold any number of entries input
        {   // # of actors is not limited to the first 3 entered (program will output all
            // stored actors for a film) (REQUIRED)
            actorName: {
                type: String,
                required: true
            },
            characterName: {
                type: String,
                required: true
            }
        }]
});

// Functionality for saving a movie to the database (used by POST route)
MovieSchema.pre('save', function(next) {
    next();
});

// return the model for exterior use
module.exports = mongoose.model('Movie', MovieSchema);