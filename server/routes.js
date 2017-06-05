const express = require('express');

const router = express.Router();
const utils = require('./utils.js');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

router.get('/questions', (request, response) => {
  database('questions').select().orderBy('created_at', 'desc')
  .then((questions) => {
    const convertedQuestions = utils.alterTimeStamp(questions);
    response.status(200).json(convertedQuestions);
  })
  .catch((error) => {
    response.status(500).send({ error });
  });
});

router.get('/questions/:id', (request, response) => {
  const { id } = request.params;
  database('questions').select().where('id', id)
  .then((question) => {
    if (!question.length) {
      response.status(404).send({ error: 'Question could not be found' });
    } else {
      response.status(200).json(...question);
    }
  })
  .catch((error) => {
    response.status(500).send({ error });
  });
});

router.get('/answers', (request, response) => {
  database('answers').select()
    .then((answers) => {
      response.status(200).json(answers);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

router.get('/answers/:question_id', (request, response) => {
  const { question_id } = request.params;
  database('answers').where({ question_id }).select().orderBy('votes', 'desc')
  .then((answers) => {
    const convertedAnswers = utils.alterTimeStamp(answers);
    response.status(200).json(convertedAnswers);
  })
  .catch((error) => {
    response.status(500).send({ error });
  });
});


router.get('/tags', (request, response) => {
  database('tags').select()
  .then((tags) => {
    response.status(200).json(tags);
  })
  .catch((error) => {
    response.status(500).send({ error });
  });
});

router.get('/questions/:id/tags', (request, response) => {
  const { id } = request.params;
  database('tags').select().where('question_id', id)
  .then((tags) => {
    if (!tags.length) {
      response.status(404).send({ error: 'No tags exist for this question' });
    } else {
      response.status(200).json(tags);
    }
  })
  .catch((error) => {
    response.status(500).send({ error });
  });
});

router.post('/answers', (request, response) => {
  const validAnswer = ['answer', 'question_id', 'user_name'].every(param => request.body[param]);
  const { answer, user_name, question_id } = request.body;

  if (!validAnswer) {
    return response.status(422).send({ error: 'You are missing content from answer ' });
  }
  database('answers').insert({ answer, user_name, question_id }, ['id', 'answer', 'user_name'])
  .then((addedAnswer) => {
    response.status(201).send(...addedAnswer);
  })
  .catch((error) => {
    response.status(500).send({ error });
  });
});


router.post('/questions', (request, response) => {
  const validQuestion = ['title', 'question', 'user_name', 'tags'].every(param => request.body[param]);
  const { title, question, user_name, tags } = request.body;

  if (!validQuestion) {
    return response.status(422).send({ error: 'You are missing content from post ' });
  }

  database('questions').insert({ title, question, user_name }, ['id', 'title', 'question', 'user_name', 'created_at'])
  .then((addedQuestion) => {
    Promise.all([
      tags.forEach((tag) => {
        database('tags').insert({ tag, question_id: addedQuestion[0].id }).then();
      }),
    ])
    .then(() => {
      response.status(201).send(...addedQuestion);
    });
  })
  .catch((error) => {
    response.status(500).send({ error });
  });
});

router.patch('/questions/:id', (request, response) => {
  const { id } = request.params;
  const { counter, value } = request.query;

  database('questions').where('id', id).select()
    .then((question) => {
      if (!question.length) {
        response.status(404).send({ error: 'Invalid Question ID' });
      } else {
        database('questions').where('id', id).max(counter)
          .then((currentMax) => {
            const newMaxValue = value === 'down' ? currentMax[0].max -= 1 : currentMax[0].max += 1;
            database('questions').where('id', id)
              .update({ [counter]: newMaxValue }, [counter])
              .then((updatedCounter) => {
                response.status(200).send(...updatedCounter);
              })
              .catch((error) => {
                response.status(500).send({ error });
              });
          });
      }
    });
});

router.get('/search/:searchTerm', (request, response) => {
  // what about tags?
  // ILIKE is case-insensitve LIKE, postgres only
  const { searchTerm } = request.params;

  database('questions')
  .where('question', 'ILIKE', `%${searchTerm}%`)
  .orWhere('title', 'ILIKE', `%${searchTerm}%`)
  .then(results => {
    response.status(200).json(results);
  })
  .catch(error => {
    response.status(500).send({ error });
  });
});

router.patch('/answers/:id', (request, response) => {
  const { id } = request.params;
  const { value } = request.query;

  database('answers').where('id', id).select()
    .then((answers) => {
      if (!answers.length) {
        response.status(404).send({ error: 'Invalid Answer ID' });
      } else {
        database('answers').where('id', id).max('votes')
          .then((currentMax) => {
            const newMaxValue = value === 'down' ? currentMax[0].max -= 1 : currentMax[0].max += 1;
            database('answers').where('id', id)
              .update({ votes: newMaxValue }, ['votes'])
              .then((updatedCounter) => {
                response.status(200).send(...updatedCounter);
              })
              .catch((error) => {
                response.status(500).send({ error });
              });
          });
      }
    });
});

module.exports = router;
