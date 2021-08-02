import React from "react";
import './Message.css'
import _uniqueId from 'lodash/uniqueId'; //let's see if this is 

const Message = ({
  messageText,
  className,
  socketid,
}) => {
  console.log(messageText);
  console.log(className);
  console.log(socketid);
  if (className === 'message other') {
    return (
      <li className={className} key={_uniqueId()}>
        <div className="messageLabel">{socketid}</div>
        <div className="messageText"> {messageText} </div>
      </li>
    );
  } else if (className === 'message own') {
    return <li className={className} key={_uniqueId()}> <div className="messageText">{messageText}</div> </li>;
  } else {
    return <li className="message" key={_uniqueId()}><div className="notice">{messageText}</div></li>;
  }


}

export default Message;