import React from 'react';
import Swal from 'sweetalert2';

const Logout = ({ setIsAuthenticated }) => {
  const handleResetApiPassword = () => {
    Swal.fire({
      icon: 'question',
      title: 'Resetting API password',
      text: 'Are you sure you want to reset the API password?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then(result => {
      if (result.value) {
        localStorage.setItem('bloxberg-api-password', '');
        setIsAuthenticated(false);
      }
    });
  };

  return (
    <button
      style={{ marginLeft: '12px' }}
      className="muted-button"
      onClick={handleResetApiPassword}
    >
      Reset api password
    </button>
  );
};

export default Logout;
