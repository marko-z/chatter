import React, { useEffect, useState } from "react";
import './Messages.css';
import Message from "./Message";
const Messages = ({messageList, sendMessage}) => {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); //The reason why we couldn't update was because we put the only reference to messageList here 

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  }

  useEffect(() => {
    setMessages(messageList);
  }, [messageList]);
  return(
    <>
      <ul id="messages">
        {messages.map(message => {
          return <Message messageText={message.messageText} className={message.className} socketid={message.socketid} />;
        })}
      </ul>


      <form id="form" onSubmit={handleSubmit}> 
        {/* <form id="form" action="">  */}
        <input name="message"
          id="input"
          autoComplete="off"
          value={message}
          onChange={e => setMessage(e.target.value)}/>
        <button>Send</button>
      </form>
    </>
  );
}

export default Messages;