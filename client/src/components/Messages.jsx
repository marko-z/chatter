import React from "react";
import './Messages.css';

const Messages = ({messageList, handleSubmit}) => {
  return(
    <div>
      <ul id="messages">
        {messageList.map(message => {
          <li className={message.className}> {message.message} </li>
        })}
      </ul>
      <form id="form" onSubmit={handleSubmit}> 
      {/* <form id="form" action="">  */}
        <input name="message" id="input" autocomplete="off" /><button>Send</button>
      </form>
    </div>
  );
}

export default Messages;