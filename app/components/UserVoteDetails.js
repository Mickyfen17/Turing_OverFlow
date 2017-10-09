import React from 'react';

import AuthButton from './AuthButton';

const UserVoteDetails = ({ user_name, user_img, votes, created_at, handleVotes, details, auth }) => {
  return (
    <div className="user-vote-info-wrapper">
      <div className="vote-details-wrapper">
        <h6>Votes</h6>
        <div className="vote-btn-wrapper">
          <AuthButton
            className="vote-up"
            name="up"
            handleClick={ handleVotes }
            auth={ auth }
          />
          { votes }
          <AuthButton
            className="vote-down"
            name="down"
            handleClick={ handleVotes }
            auth={ auth }
          />
        </div>
      </div>
      <div className="detail-user-info">
        <p>{ details } { created_at }</p>
        <div className="detail-user-container">
          <p className="user_name">{ user_name }</p>
          <img className="user-image" src={user_img}></img>
        </div>
      </div>
    </div>
  );
};

export default UserVoteDetails;