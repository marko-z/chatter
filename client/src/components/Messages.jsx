import React, { useEffect, useState } from "react";
import './Messages.css';
import Message from "./Message";

const Messages = ({messageList}) => {

  const [messages, setMessages] = useState([]); 

  useEffect(() => {
    setMessages(messageList);
  }, [messageList]);

  return(
    <ul id="messages">
      {messages.map(message => {
        return <Message messageText={message.messageText} className={message.className} socketid={message.socketid} />;
      })}
    </ul>
  );
}

export default Messages;