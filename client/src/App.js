import React, { useEffect, useState } from 'react';
import Users from "./components/Users";
import Messages from "./components/Messages";
import InputBox from './components/InputBox';
import { io } from "socket.io-client";
import './App.css';

//Should I make a separate file with this so that all the components that need it can access it separately?
//I mean I can't really do it because it will re-initialize every time it's imported
//Though perhaps I can export it from here? i.e. export const socket = ...
export const socket = io('ws://localhost:3001')


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