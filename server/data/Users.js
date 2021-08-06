class Users {
    constructor() {
        this.users = [];
    }

    addUser(userdata, guest=true) {
        /**
         * userdata: { id, username, password }, guest: false
         * userdata: { id, username }, guest: true
         */

        if (guest) { //Not persistent
            this.users.push({type, username:userdata.username });
        } else { //Persistent
            this.users.push({type, username:userdata.username, password: userdata.password});
        }
    }

    getUser(id) {
        return this.users.find(user => user.id === id);
    }

    removeUser(id) {
        this.users.filter(user => user.id !== id);
    }
}

module.exports = Users;