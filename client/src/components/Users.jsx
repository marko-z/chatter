import React  from "react";
import './Users.css';


const Users = ({
  userList
}) => {
  return (
    <ul id="users">
      {userList.map(user => {
        return <li className="user">{user.data}</li>
      })}
    </ul>
  );
}

export default Users;