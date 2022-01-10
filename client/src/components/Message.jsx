import React from "react";
import './Message.css'
import _uniqueId from 'lodash/uniqueId'; 

const Message = ({
  messageText,
  className,
  socketid,
}) => {

  // id = "messages"
  //   class = "message"
  //     class = "notice"
  //   class = "message own"
  //     class = "messageLabel"
  //     class = "messageText"
  //   class = "message other"
  //     class = "messageText"
  
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
