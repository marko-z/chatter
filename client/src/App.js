import React, { useEffect, useState} from 'react';
import Users from "./components/Users";
import Login from './components/Login';
import Messages from "./components/Messages";
import InputBox from './components/InputBox';
import './App.css';

const App = () => {
  // user is not persistent across page reloads unless we use sessionStorage
  // but the process of establishing locally stored username gets really messy
  // with the cookie + locally generated token combo so we settle with receiving
  // our username from the server upon connection, then propagating to InputBox via redux. 
  const [user, setUser] = useLocalStorage('user', 'not logged in');
  const [cookieApproved, setCookieApproved] = useState(null);
  
  useEffect(() => {

    // checking cookie validity
    const checkCookie = async () => {
      return fetch('http://localhost:3000/vibecheck', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'withCredentials': true,
        },
      }).then((response) => {
        if (response.ok) {
          console.log('cookie accepted');
          setCookieApproved(true)
        }
        else {
          console.log('cookie rejected');
          setCookieApproved(false)
        }
      })
    }
    checkCookie();
  }, [])

  useEffect(() => {
    console.log(`User value in app.js: ${user}`);
  }, [user]);

  if (cookieApproved === null) { return 'Loading...' };
  if (cookieApproved === false) {
    return (<>
      <div className="sidebar"></div>
      <div className="content">
        {/* <div className="bar"></div> */}
        <Login setUser={setUser}/>
        {/* <div className="bar"></div> */}
      </div>
      <div className="sidebar"></div>
    </>);
  } else {
    return (
      <>
        <div className="sidebar" id="user-sidebar">
          <Users />
        </div>
        <div className="content">
          <Messages user={user} />
          <InputBox user={user} />
        </div>
        <div className="sidebar"></div>
      </>
    );
  }
}

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export default App;
