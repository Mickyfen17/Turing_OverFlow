import 'whatwg-fetch';

const fetchAllQuestionsAction = (questions) => {
  return {
    type: 'FETCH_ALL_QUESTIONS',
    questions,
  };
};

const fetchPopularQuestionsAction = (popularQuestions) => {
  return {
    type: 'FETCH_POPULAR_QUESTIONS',
    popularQuestions,
  };
};

const fetchRecentTagsAction = (recentTags) => {
  return {
    type: 'FETCH_RECENT_TAGS',
    recentTags,
  };
};

const searchResults = (searchResults) => {
  return {
    type: 'ADD_SEARCH_RESULTS',
    searchResults,
  };
};

export const addHistoryToStore = (history) => {
  return {
    type: 'ADD_HISTORY_TO_STORE',
    history,
  };
};

export const userLogin = (user) => {
  return {
    type: 'USER_LOGIN',
    user,
  };
};

export const userLogout = (user) => {
  return {
    type: 'USER_LOGOUT',
    user,
  };
};

export const fetchAllQuestions = () => {
  return dispatch =>
  fetch('/api/v1/questions')
  .then(response =>
    response.json(),
  )
  .then((questions) => {
    dispatch(fetchAllQuestionsAction(questions));
  });
};

export const fetchPopularQuestions = () => {
  return dispatch =>
  fetch('/api/v1/questions/popular')
  .then(response =>
    response.json(),
  )
  .then((questions) => {
    dispatch(fetchPopularQuestionsAction(questions));
  });
};

export const fetchRecentTags = () => {
  return dispatch =>
  fetch('/api/v1/tags/recent')
  .then(response =>
    response.json(),
  )
  .then((tags) => {
    dispatch(fetchRecentTagsAction(tags));
  });
};

export const fetchSearch = (searchTerm) => {
  return dispatch => {
    return fetch(`/api/v1/search/${searchTerm}`)
    .then((response) => {
      response.json()
      .then((json) => {
        dispatch(searchResults({ searchTerm, resultsArray: json }));
      });
    });
  };
};

export const fetchTag = (tag) => {
  return dispatch => {
    return fetch(`/api/v1/search/tag/${tag}`)
    .then((response) => {
      return response.json();
    })
    .then((json) =>
      dispatch(searchResults({ searchTerm: tag, resultsArray: json })),
    );
  };
};

export const fetchQuestion = (id) => {
  return () =>
  fetch(`/api/v1/questions/${id}`)
  .then(response =>
    response.json(),
  );
};

export const fetchQuestionTags = (id) => {
  return () =>
  fetch(`/api/v1/questions/${id}/tags`)
  .then(response =>
      response.json(),
  );
};

export const addQuestion = (title, question, name, picture, tags) => {
  return () =>
    fetch('/api/v1/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, question, user_name: name, user_img: picture, tags }),
    })
    .then(response =>
      response.json(),
    );
};


export const updateQuestionCounters = (id, direction, counter) => {
  return () =>
    fetch(`/api/v1/questions/${id}?counter=${counter}&value=${direction}`, {
      method: 'PATCH',
    })
    .then(response =>
      response.json(),
    );
};

export const updateAnswerCounters = (id, direction) => {
  return () =>
    fetch(`/api/v1/answers/${id}?value=${direction}`, {
      method: 'PATCH',
    })
    .then(response =>
      response.json(),
    );
};

export const addAnswer = (question_id, answer, name, picture) => {
  return () =>
    fetch('/api/v1/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id, user_name: name, answer, user_img: picture }),
    })
    .then(response =>
      response.json(),
    );
};
