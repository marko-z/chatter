import React from "react";
import './Message.css'
const Message = ({
  messageText,
  className,
  socketid,
}) => {
  console.log(messageText);
  console.log(className);
  console.log(socketid);
  if (className === 'message other') {
    console.log('message other');
    return (
      <li className={className}> 
        <div className="messageLabel">{socketid}</div>
        <div className="messageText"> {messageText} </div>
      </li>
    )} else if (className === 'message own') {
      console.log('message own');
      return <li className={className}> <div className="messageText">{messageText}</div> </li>;
    } else {
    console.log('notice');
    return <li className="message"><div className="notice">{messageText}</div></li> 
  }
  
      
}

export default Message;