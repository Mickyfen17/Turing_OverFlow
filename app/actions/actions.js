import 'whatwg-fetch';

const fetchAllQuestionsAction = (questions) => {
  return {
    type: 'FETCH_ALL_QUESTIONS',
    questions,
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

export const fetchQuestionTags = (id) => {
  return () =>
  fetch(`/api/v1/questions/${id}/tags`)
  .then(response =>
      response.json(),
  );
};

export const addQuestion = (title, question, name, tags) => {
  return () =>
    fetch('/api/v1/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, question, user_name: name, tags }),
    })
    .then(response =>
      response.json(),
    );
};

