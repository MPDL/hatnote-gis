import React from 'react';
import Swal from 'sweetalert2';

const Login = ({ setIsAuthenticated, password, setPassword }) => {
  const handleSetApiPassword = e => {
    e.preventDefault();

    if (password !== null && password !== '') {
      localStorage.setItem('bloxberg-api-password', password);
      setIsAuthenticated(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Enter an api password.',
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="small-container">
      <form onSubmit={handleSetApiPassword}>
        <h1>Set API password</h1>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="your api password..."
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input style={{ marginTop: '12px' }} type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
