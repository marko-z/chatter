const passport = require("passport");
const Users = require("../data/Users");
const users = new Users();
const LocalStrategy = require('passport-local').Strategy;
//Could not work?
const bcrypt = require('bcrypt');
//When do we need to use the await with bcrypt?

passport.use(new LocalStrategy( (username, password, done) => {
    const user = users.findUser(username);
    bcrypt.compare(password, user.password, (err, same) => {
        if (err) throw err;
        if (same) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }) //compare input password with stored hash
}));


//add user id to request.session.passport object
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//retrieve id from request.session.passport, look up in database and save to request.user
passport.deserializeUser((userid, done) => {    
    const user = users.getUser(userid);
    done(null, user);
})

module.exports.users = users;