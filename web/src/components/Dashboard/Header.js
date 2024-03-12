import React from 'react';

import Logout from '../Logout';
import Swal from "sweetalert2";

const Header = ({ setIsAdding, setIsAuthenticated, setIsInstitutesEntries, isInstitutesEntries, handleLoadData }) => {

    const handleChangeEntries = () => {
        setIsInstitutesEntries(!isInstitutesEntries)
        handleLoadData(!isInstitutesEntries)
    };

  return (
    <header>
      <h1>{isInstitutesEntries ? "Hatnote Geographic Information System - MPG Institutes" : "Hatnote Geographic Information System - Bloxberg Validators"}</h1>
        <div style={{marginTop: '30px', marginBottom: '18px'}}>
            <button onClick={() => setIsAdding(true)}>{isInstitutesEntries ? "Add institute" : "Add validator"}</button>
            <button
                style={{marginLeft: '12px'}}
                className="muted-button"
                onClick={handleChangeEntries}
            >
                {isInstitutesEntries ? "Edit bloxberg validators": "Edit MPG institutes"}
            </button>
            <Logout setIsAuthenticated={setIsAuthenticated}/>
        </div>
    </header>
  );
};

export default Header;
