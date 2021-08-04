import React, { useEffect, useState } from "react";
import './Messages.css';
import Message from "./Message";
import { socket } from "../App";

const Messages = () => {

  const [messages, setMessages] = useState([]); 

  useEffect(() => {

    socket.on('new message', ({ messageText, socketid, notice }) => {

      let className;
      
      if (notice === true) {
        className = 'notice';
      } else {
        className = (socket.id === socketid) ? 'message own' : 'message other';
      }
      
      setMessages(messages => [...messages, {className, messageText, socketid}]);
    });
  }, []);


  return(
    <ul id="messages">  
      {messages.map(message => {
        return <Message messageText={message.messageText} className={message.className} socketid={message.socketid} />;
      })}
    </ul>
  );
}

export default Messages;