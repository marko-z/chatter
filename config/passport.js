const passport = require("passport");
const Users = require("../data/Users");
const users = new Users(); //could alternatively import it from server?
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
//When do we need to use the await with bcrypt?

passport.use(new LocalStrategy( (username, password, done) => {
    const user = users.findUser(username);
    if (!user) {
        return done(null, false, { message: 'User not found'}); //USER NOT FOUND
    }
    console.log(user);

    bcrypt.compare(password, user.password, (err, same) => {
        if (err) throw err;
        if (same) {
            return done(null, user, {message: 'User found'});
        } else {
            return done(null, false, { message: 'Incorrect password'}); //WRONG PASSWORD
        }
    }) //compare input password with stored hash
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userid, done) => {    
    const user = users.getUser(userid);
    done(null, user);
})

module.exports.users = users;
