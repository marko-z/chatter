import React  from "react";
import './Users.css';


const Users = ({
  userList
}) => {
  return (
    <ul id="users">
      {userList.map(user => {
        return <li className="user" key={user}>{user}</li>
      })}
    </ul>
  );
}

export default Users;