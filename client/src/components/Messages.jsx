import React, { useEffect, useState } from "react";
import './Messages.css';
import Message from "./Message";
import { io } from "socket.io-client";
// import { socket } from "../App";
export const socket = io('ws://localhost:3000'); 
//if we didn't go through proxy (instead localhost:3001 - i.e server), it messes up the sesssions  - separate session created for the socket.io, 
//so we're never able to access the user object which is created on register (so regular route)

const Messages = () => {
  
  const [messages, setMessages] = useState([]); 
  
  useEffect(() => {
    
    socket.emit('enteredChat');
    socket.on('new message', ({className, messageText, username }) => {
      setMessages(messages => [...messages, {className, messageText, username}]);
    });
  }, []);


  return(
    <ul id="messages">  
      {messages.map(message => {
        return <Message messageText={message.messageText} className={message.className} username={message.username} />;
      })}
    </ul>
  );
}

export default Messages;