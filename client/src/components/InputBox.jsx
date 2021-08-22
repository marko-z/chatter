import React, { useState } from "react";
import './InputBox.css';
import { socket } from "./Messages";
import { FaPaperPlane } from "react-icons/fa";

const InputBox = () => {

  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      socket.emit('new message', input);
      setInput('');
    }
  }

  return (
    <form id="form" onSubmit={handleSubmit}>
      {/* <form id="form" action="">  */}
      <input name="message"
        id="input"
        autoComplete="off"
        value={input}
        onChange={e => setInput(e.target.value)} />
      <button id='message-button'><FaPaperPlane /></button>
    </form>
  );
}

export default InputBox;