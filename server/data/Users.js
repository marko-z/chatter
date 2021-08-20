class Users {
    constructor() {
        this.users = [];
        this.counter = 1;
    }

    addUser(userdata, guest=true) {
        /**
         * userdata: { id, guest, username, password }, guest: false
         * userdata: { id, guest, username }, guest: true
         */
        let user;
        if (guest) { //Not persistent
            user = {id: this.counter++, type:userdata.type, username:userdata.username }
        } else { //Persistent
            user = {id: this.counter++, type:userdata.type, username:userdata.username, password: userdata.password}
        }
        this.users.push(user);
        console.log(`Database: added user ${user}`);
        return user;
    }

    getUser(id) {
        return this.users.find(user => user.id === id);
    }

    findUser(username) {
        return this.users.find(user => user.username === username);
    }

    getUsernames() {
        return this.users.map(user => { return {id: user.id, username: user.username}});
    }

    removeUser(id) {
        this.users.filter(user => user.id !== id);
    }
}

module.exports = Users;