const passport = require("passport");
const Users = require("../data/Users");
const { Strategy } = require('passport-local');
const LocalStrategy = Strategy();
//Could not work?
const bcrypt = require('bcrypt');
//When do we need to use the await?

passport.use(new LocalStrategy( (username, password, cb) => {
    const user = Users.getUser(username);
    if (bcrypt.hash(password, 10) === user.passwordHash) {
        cb(null, user);
    } else {
        cb(null, false);
    }
}));

