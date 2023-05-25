var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
let envPath = __dirname + "/../.env" // go back 1 from current dir and look for env file
require('dotenv').config({path:envPath});
var env = process.env;

var opts = {}; // options
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt"); // get token from header
opts.secretOrKey = process.env.SECRET_KEY; // searches for Secret Key in render environment

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    var user = env.SECRET_KEY;

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
}));

exports.isAuthenticated = passport.authenticate('jwt', { session : false });
exports.secret = opts.secretOrKey ;