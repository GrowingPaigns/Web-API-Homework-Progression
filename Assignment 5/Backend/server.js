/*
* CSCI 3916 HW3
* Samuel Hilfer
* Description: Web API backend program for Movie Database
* node parameter in run config injects the dotenv config when we start server.js
*/

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');
const mongoose = require("mongoose");

var app = express(); // creates express server
app.use(cors()); // allows the browser to make a call to the server
app.use(bodyParser.json()); // removes the need to manually parse objects
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

var router = express.Router(); // for handling requests

const signInUpMethods = ['POST'] // limited only to POST
const movieMethods = ['POST', 'DELETE', 'PUT', 'GET'] // limited to CRUD operations

function methodCheck(req, res, next) { // Method call check for (/signin /signup) routes
    const method = req.method.toUpperCase();
    if (!signInUpMethods.includes(method)) {
        return res.status(405).send('Unsupported HTTP Method [' + method + '] Input');
    } else {
        next();
    }

}
function movieMethodCheck(req, res, next) { // Method call check for (/movies) route
    const method = req.method.toUpperCase(); // makes sure all received methods are capitalized for comparison
    if (!movieMethods.includes(method)) {
        return res.status(405).send('Unsupported HTTP Method [' + method + '] Input');
    } else {
        next();
    }

}

// check if call to base URL was made
router.all('/', (req, res) => {
    if (req.originalUrl === '/') {
        res.status(401).send('[ERROR - Tried to Access Base URL]');
        return;
    }
});

/* Method Check: ensure that no improper methods were used in sign in/up process */
router.route(['/signup', '/signin'])
    .all(methodCheck) // does not account for HEAD or OPTIONS
/* Method Check: ensure that no improper methods were used in movies CRUD process */
router.route('/movies')
    .all(movieMethodCheck)

/* Server Route #1: Signing Up */
// connect to router which is listening for a post on the 'signup' path
// set up anon function which takes request/response (ONLY LISTENS FOR 'POST')
router.post('/signup', (req, res) => { // takes in json object body
    // checks if all fields are filled out
    if (!req.body || !req.body.username || !req.body.password || !req.body.name) {
        res.json({success: false, message: '[ERROR - Please include name, username, and password to signup]'})
    } else { // if fields have all been filled...
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function (err) { // save new user to the database
            if (err) {
                if (err.code == 11000) // checks if user exists
                    return res.status(200).json({ // returns status 200 because it simply checks if a user exists
                        success: false,
                        message: '[A user with that username already exists]'
                    });
                else { // if there is any other error....
                    return res.status(500).json(err);
                }
            }
            // if no error is encountered, save and send success msg
            res.status(200).json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

/* Server Route #2: Signing in */
router.post('/signin', function (req, res) {
    var userNew = new User();
    if (!req.body || !req.body.username) {
        return res.status(400).send('[ERROR - cannot sign-in without a username]');
    } else {
        userNew.username = req.body.username;
    }
    if (!req.body|| !req.body.password) {
        return res.status(400).send('[ERROR - cannot sign-in without a password]');
    } else {
        userNew.password = req.body.password;
    }

    // finds stored user based off of input query. If found, specify that we do actually want the password
    // to return from the select call; need to exec it to get proper permissions for the select
    User.findOne({username: userNew.username}).select('name username password').exec(function (err, user) {
        if (err) { // if no user exists in the DB...
            console.log('[ERROR ENCOUNTERED WHILE SIGNING IN]', err)
            res.status(400).send('[ERROR - Unable to find User with provided credentials]');
        }

        // if the password for the user matches stored db entry, generate a JWT token that the user
        // can use to perform CRUD operations, which is based off of the secret key
        user.comparePassword(userNew.password, function (isMatch) {
            if (isMatch) {
                var userToken = {id: user.id, username: user.username};
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.status(200).json({success: true, token: 'JWT ' + token});
            } else { // cant find matching password...
                res.status(401).json({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});


/* Server Route #3: Movie Collection */
// Performs CRUD operations given that JWT token is authenticated
// Checks alternate/specific routes and returns proper response(s)

// Returns all movies in the database unless it is empty
router.get('/movies', authJwtController.isAuthenticated, (req, res) => {
    Movie.find({}, function (err, movies) {
        if (err) {
            return res.status(500).send(err);
        }
        if (!movies) {
            return res.status(401).send('[ERROR - There are no Movies in the database]').json({
                success: false,
                msg: 'Movies database is empty'
            });
        }
        res.status(200).json(movies); // send json results back to the object
    });

});

// Returns a specific movie based off provided parameters (title)
// couldn't figure out how to query multiple different parameters, so only title searches currently work
router.get('/movies/:title', authJwtController.isAuthenticated, (req, res) => {
    var movie = new Movie();
    if (req.params.title) {
        movie.title = req.params.title;
    } else { // if no parameter is provided
        res.send('[ERROR - please specify the title you are looking for]');
    }


    Movie.findOne({title: movie.title}, function (err, movieFound) {
        if (err) {
            return res.status(500).send('[ERROR ENCOUNTERED WHILE CHECKING FOR PARAMETER]');
        }

        if (!movieFound) {
            return res.status(404).send('[ERROR - Unable to find a movie with those parameters]');
        } else {
            res.status(200).json(movieFound)
        }

    });

});

// Adds a new movie to the DB based off of provided request body
router.post('/movies', authJwtController.isAuthenticated, (req, res) => {
    var addMovie = new Movie();

    // if any of the values are blank, return an error
    if (req.body.title) {
        addMovie.title = req.body.title;
    } else {
        res.status(400).send('[ERROR - cannot add movie without a TITLE]');
    }
    if (req.body.releaseDate) {
        addMovie.releaseDate = req.body.releaseDate;
    } else {
        res.status(400).send('[ERROR - cannot add movie without a RELEASE DATE]');
    }
    if (req.body.genre) {
        addMovie.genre = req.body.genre;
    } else {
        res.status(400).send('[ERROR - cannot add movie without a GENRE]');
    }
    if (req.body.actors) {
        addMovie.actors = req.body.actors;
    } else {
        res.status(400).send('[ERROR - cannot add movie without ACTORS]');
    }

    // if all fields are filled, check if the movie title already exists in the DB
    Movie.findOne({title: addMovie.title}, function (err, existingMovie) {
        if (err) {
            return res.status(500).send('[ERROR ENCOUNTERED WHILE CHECKING FOR MATCHING TITLES]');
        }

        if (existingMovie) {
            return res.status(401).send('[ERROR - This movie already exists in the database]');
        }

        // if no errors and movie doesn't exist...
        addMovie.save(function (err) {
            if (err) {
                return res.status(401).send('[ERROR - issue encountered while saving movie]');
            }
            res.status(200).json({success: true, msg: 'Successfully posted new movie to database'})
        });
    });

});
// if trying to add a movie with a parameter, return error
router.post('/movies/:title', authJwtController.isAuthenticated, (req, res) => {
    return res.status(500).send('[ERROR - Tried to post a movie from an invalid address]');
});
// if trying to update the entire movie list (no param added), return error
router.put('/movies', authJwtController.isAuthenticated, (req, res) => {
    return res.status(500).send('[ERROR - Cannot update ALL movies - please provide specific title]');
});
// if a movie is found that matches the parameter  and all request body fields are filled, update movie
router.put('/movies/:title', authJwtController.isAuthenticated, (req, res) => {
    var updateMovie = {};

    if (req.body.title) {
        updateMovie.title = req.body.title;
    } else {
        res.send('[ERROR - cannot update movie without a TITLE]');
    }
    if (req.body.releaseDate) {
        updateMovie.releaseDate = req.body.releaseDate;
    } else {
        res.send('[ERROR - cannot update movie without a RELEASE DATE]');
    }
    if (req.body.genre) {
        updateMovie.genre = req.body.genre;
    } else {
        res.send('[ERROR - cannot update movie without a GENRE]');
    }
    if (req.body.actors) {
        updateMovie.actors = req.body.actors;
    } else {
        res.send('[ERROR - cannot update movie without ACTORS]');
    }

    // have to use this before findOneAndUpdate because it is a depreciated method
    mongoose.set('useFindAndModify', false);

    // checks if the title from the body already exists in the db
    Movie.findOne({title: updateMovie.title}, function (err, existingMovie) {

        if (existingMovie) {
            return res.status(401).send('[ERROR - This movie already exists in the database]');
        } else {
            // if title doesn't exist, update the movie as specified by parameter and req.body
            Movie.findOneAndUpdate({title: req.params.title}, {$set: updateMovie}, {new: true}, function (err, movieUpdated) {
                if (err) {
                    return res.status(500).send('[ERROR ENCOUNTERED WHILE CHECKING FOR PARAMETER]');
                }

                if (!movieUpdated) {
                    return res.status(400).send('[ERROR - Unable to find a movie with those parameters]');
                } else {
                    res.status(200).json(movieUpdated)
                }

            });
        }
    });
});
// if someone tries to delete all movies, return error
router.delete('/movies', authJwtController.isAuthenticated, (req, res) => {
    return res.status(500).send('[ERROR - Cannot delete ALL movies - provide specific title]');

});
// if a movie is found based off the parameter, remove that movie from the DB
router.delete('/movies/:title', authJwtController.isAuthenticated, (req, res) => {
    Movie.findOne({title: req.params.title}, function (err, movieFound) {
        if (err) {
            return res.status(500).send('[ERROR ENCOUNTERED WHILE CHECKING FOR PARAMETER]');
        }

        if (!movieFound) {
            return res.status(400).send('[ERROR - Unable to find a movie with those parameters]');
        } else {
            movieFound.remove();
            res.status(200).json({success: true, msg: 'Movie has been deleted'})
        }

    });

});


app.use('/', router); // app.use on root
app.listen(process.env.PORT || 8080); // port taken from render/local machine
module.exports = app; // for unit testing - without export, we cant leverage the file



