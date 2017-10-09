import React from 'react';

const AuthButton = ({ handleClick, className, name, btnName, auth }) => {
  const handleAuth = e => {
    if (!auth.loggedIn()) {
      auth.login();
    } else {
      handleClick(e);
    }
  };
  return (
    <button
      className={`btn ${className}`}
      name={name}
      onClick={e => handleAuth(e)}
    >
      {btnName}
    </button>
  );
};

export default AuthButton;
