import React, { useState, useEffect } from 'react';

import Login from '../Login';
import Dashboard from '../Dashboard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [password, setPassword] = useState('');

  useEffect(() => {
      const api_pw = localStorage.getItem('bloxberg-api-password')
      setPassword(api_pw)
      setIsAuthenticated(api_pw !== null && api_pw !== '');
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Dashboard setIsAuthenticated={setIsAuthenticated} password={password}/>
      ) : (
        <Login setIsAuthenticated={setIsAuthenticated} setPassword={setPassword} password={password}/>
      )}
    </>
  );
};

export default App;
