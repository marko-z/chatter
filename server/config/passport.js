const passport = require("passport");
const Users = require("../data/Users");
const users = new Users();
const LocalStrategy = require('passport-local').Strategy;
//Could not work?
const bcrypt = require('bcrypt');
//When do we need to use the await with bcrypt?

passport.use(new LocalStrategy( (username, password, done) => {
    const user = users.getUser(username); //So do I have to implement additional search-by-username function to users?
    bcrypt.compare(password, user.password, (err, same) => {
        if (err) throw err;
        if (same) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }) //compare input password with stored hash
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userid, done) => { //why do we put userId here but not in serializeUser?  
    const user = users.getUser(userid);
    done(null, user); //I understand serializeUser to add userid to the session but what purpose does this serve?
})

module.exports.users = users;