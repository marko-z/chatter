import React, { useState } from "react";
import './InputBox.css';

const InputBox = ({sendMessage}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  }

  return (
    <form id="form" onSubmit={handleSubmit}>
      {/* <form id="form" action="">  */}
      <input name="message"
        id="input"
        autoComplete="off"
        value={input}
        onChange={e => setInput(e.target.value)} />
      <button>Send</button>
    </form>
  );
}

export default InputBox;