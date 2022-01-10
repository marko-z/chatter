import React, { useEffect, useState } from "react";
import './Messages.css';
import Message from "./Message";
import { io } from "socket.io-client";
export const socket = io('ws://localhost:3000');

const Messages = ({ user }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log(`user value in messages.js: ${user}`);
    socket.emit('enteredChat', user);

    socket.on('new message', ({ className, username, messageText }) => {
      setMessages(messages => [...messages, { className, username, messageText }]);
    });
    socket.on('updateMessageList', messageList => {
      setMessages(messageList);
    })

    return () => socket.emit('leaveChat', user);
  }, [user]);

  // Why aren't the messages showing who wrote them
  return (
    <ul id="messages">
      {messages.map(message => {
        return <Message key={Math.floor(Math.random() * 100)}
          messageText={message.messageText}
          className={message.className}
          username={message.username}
        />;
      })}
    </ul>
  );
}

export default Messages;
