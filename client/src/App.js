import React, { useEffect, useState } from 'react';
import Users from "./components/Users";
import Messages from "./components/Messages";
import { io } from "socket.io-client";
import './App.css';

const socket = io('ws://localhost:3001')


const App = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.value;
    if (message) {
      socket.emit('new message', e.target.value)
      e.input.value = '';
    }
  }

  useEffect(() => {
    socket.on('updateUserList', (data) => {
      setUsers(data);
    });

    socket.on('new message', ({message, socketid, notice}) => {

      let className;

      if (notice) {
        className = 'notice';
      } else {
        className = (socket.id === socketid) ? 'message own' : 'message other';
      }
      
      setMessages([...messages, {
        className,
        messageText: message,
        socketid,
      }]);
    });

  });

  return (
    <div className="app">
      <div className="sidebar" id="user-sidebar">
        <Users userList={users} />
      </div>
      <div className="content">
        <Messages messageList={messages} handleSubmit={handleSubmit}/>
      </div>
      <div className="sidebar"></div>
    </div>
  );
}

export default App;
