import React from 'react';
import Users from "./components/Users";
import Messages from "./components/Messages";
import InputBox from './components/InputBox';
import { io } from "socket.io-client";
import './App.css';


export const socket = io('ws://localhost:3001');

const App = () => {
  return (
    <>
      <div className="sidebar" id="user-sidebar">
        <Users />
      </div>
      <div className="content">
        <Messages />
        <InputBox />
      </div>
      <div className="sidebar"></div>
    </>
  );
}

export default App;