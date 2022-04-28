import './App.css';
import NavBar from './Components/NavBar/NavBar';
import { useEffect } from 'react';
import useSessionStorage from './Hooks/useSessionStorage';

import { userContext } from './Context'

function App() {
  const [username, setUsername] = useSessionStorage("displayName", "");


  useEffect(() => {
    CheckUser()
  }, [])

  function Logout() {
    if (window.confirm("Are you sure you want to Logout?")) {
      fetch("/api/logout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      setUsername("");
    }
  }

  //Checks if the Token is valid and not expired and returns the user's username to be stored in session storage
  function CheckUser() {
    fetch("/api/getTokenData", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(data => {
      if (data === "Invalid") {
        setUsername("");
        return;
      }

      setUsername(data)
    })
  }

  return (
    <>
      <userContext.Provider value={{ username, setUsername, Logout, CheckUser }}>
        <NavBar />
      </userContext.Provider>
    </>

  );
}

export default App;
