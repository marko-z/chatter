import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Users from "./components/Users";
import Login from './components/Login';
import Messages from "./components/Messages";
import InputBox from './components/InputBox';
import { io } from "socket.io-client";
import './App.css';


export const socket = io('ws://localhost:3001');

const App = () => {

    //check for the cookie in the browser and redirect to login?
  return (
    <>
    <Router>
      <Route path="/login">
        <div className="sidebar"></div>
        <div className="content">
          {/* <div className="bar"></div> */}
          <Login />
          {/* <div className="bar"></div> */}
        </div>
        <div className="sidebar"></div>
      </Route>
      <Route exact path="/">
        <div className="sidebar" id="user-sidebar">
          <Users />
        </div>
        <div className="content">
          <Messages />
          <InputBox />
        </div>
        <div className="sidebar"></div>
      </Route>
    </Router>
      
    </>
  );
}

export default App;