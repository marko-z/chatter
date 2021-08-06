import React, { useEffect, useState } from 'react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username2, setUsername2] = useState('');
  const [password2, setPassword2] = useState('');

  useEffect(() => {
    if (username2 || password2) {
      setUsername('');
      setPassword('');
    }
    if (username || password) {
      setUsername2('');
      setPassword2('');
    }
  },[username, password, username2, password2])

  return (
    <>
      <div className='vertical-bar'></div>
      <form id='login'>
        <div className='separator'>Sign up</div>
          <input type='text' className='login-input' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type='password' className='login-input' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type='password' className='login-input' placeholder='Confirm Password'  />
          <button className='login-button'>Sign up</button>
        <div className='separator'>Log in (no password for guest)</div>
          <input type='text' className='login-input' placeholder='Username' value={username2}  onChange={(e) => setUsername2(e.target.value)} />
          <input type='password' className='login-input' placeholder='Password' value={password2} onChange={(e) => setPassword2(e.target.value)} />
          <button className='login-button'>Sign in</button>
      </form>
      <div className='vertical-bar'></div>
    </>
  )
}

export default Login;