import React from 'react';

const TagLink = ({ name, added, handleDelete, fetchTag, history }) => {

  const searchDB = () => {
    fetchTag(name).then(() => history.push(`/search/tag/${name}`));
  };

  return (
    <a className="tag-link" onClick={ () => searchDB() }>
      { name }
      { added === 'ask' &&
        (<span
          className="delete-tag-btn"
          onClick={ () => handleDelete(name) }>
          X
        </span>)
      }
    </a>
  );
};

export default TagLink;
