import React, { useState, useEffect }  from "react";
import './Users.css';
// import { socket } from "../App";
import { socket } from "./Messages";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('updateUserList', (users) => {
      setUsers(users);
    });
  }, []);

  if (users) {
    return (
    <ul id="users">
      {users.map(user => {
        return <li className="user" key={user.id}>{user.username}</li>
      })}
    </ul>
   );
  }
  
}

export default Users;