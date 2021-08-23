import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import Users from "./components/Users";
import Login from './components/Login';
import Messages from "./components/Messages";
import InputBox from './components/InputBox';
// import { io } from "socket.io-client";
import './App.css';
import Cookies from 'js-cookie';

//can i defer this somehow? I don't want to connect to socket on the login page
// export const socket = io('ws://localhost:3001'); //what if we changed this to localhost:3000 - would we be able to remove the cors from the server?

const App = () => {
    //check for the cookie in the browser and redirect to login?
  const history = useHistory();

  if (!Cookies.get('connect.sid')) { //important that the connect.sid has httpOnly attribute set to false otherwise it won't be exposed to javascript
    console.log('no cookie so serving login')
    history.push('/login');
  }
  
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