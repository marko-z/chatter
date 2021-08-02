import React, { useEffect, useState } from 'react';
import Users from "./components/Users";
import Messages from "./components/Messages";
import InputBox from './components/InputBox';
import { io } from "socket.io-client";
import './App.css';

const socket = io('ws://localhost:3001')

const App = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const sendMessage = (message) => {
    if (message) {
      socket.emit('new message', message);
    }
  }

  useEffect(() => {
    socket.on('updateUserList', (users) => {
      setUsers(users);
    });

    socket.on('new message', ({ messageText, socketid, notice }) => {

      let className;
      // console.log(messageText);
      // console.log(socketid);
      // console.log(notice);

      if (notice === true) {
        className = 'notice';
      } else {
        className = (socket.id === socketid) ? 'message own' : 'message other';
      }

      // console.log(`Before: ${JSON.stringify(messages, null, 4)}`);

      setMessages([...messages, {
        className,
        messageText,
        socketid,
      }]);

      // console.log(`After: ${JSON.stringify(messages, null, 4)}`);
    });
  });

  return (
    <>
      <div className="sidebar" id="user-sidebar">
        <Users userList={users} />
      </div>
      <div className="content">
        <Messages messageList={messages} />
        <InputBox sendMessage={sendMessage} />
      </div>
      <div className="sidebar"></div>
    </>
  );
}

export default App;
