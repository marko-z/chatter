import React, { useState, useEffect }  from "react";
import './Users.css';
import { socket } from "./Messages";
// import { Math } from "Math";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('updateUserList', (userList) => {
      console.log(`users: ${userList}`);
      setUsers(userList);
    });
  }, []);

  if (users) {
    return (
    <ul id="users">
      {users.map((user) => {
        return <li className="user" key={Math.floor(Math.random() * 100)}>{user}</li>
      })}
    </ul>
   );
  }
  
}

export default Users;