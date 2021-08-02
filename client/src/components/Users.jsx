import React, { useState, useEffect }  from "react";
import './Users.css';
import { socket } from "../App";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('updateUserList', (users) => {
      setUsers(users);
    });
  });

  return (
    <ul id="users">
      {users.map(user => {
        return <li className="user" key={user}>{user}</li>
      })}
    </ul>
  );
}

export default Users;