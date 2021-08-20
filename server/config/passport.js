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


//add user to session.passport object
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//don't quite understand the purpose of this one, is it to be able to return the user object when removing user from session?
passport.deserializeUser((userid, done) => {    
    const user = users.getUser(userid);
    done(null, user); //I understand serializeUser to add userid to the session but what purpose does this serve?
})

module.exports.users = users;