process.env.NODE_ENV = 'test';

const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const chai = require('chai');

const should = chai.should();
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/main');

chai.use(chaiHttp);

describe('API Routes', () => {
  beforeEach((done) => {
    database.migrate.latest()
    .then(() => {
      return database.seed.run();
    })
    .then(() => {
      done();
    });
  });

  afterEach((done) => {
    database.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('GET /questions', () => {
    it('should return all questions', (done) => {
      chai.request(server)
      .get('/api/v1/questions')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.should.have.length(2);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('title');
        response.body[0].should.have.property('question');
        response.body[0].should.have.property('user_name');
        response.body[0].should.have.property('views');
        response.body[0].should.have.property('answers');
        response.body[0].should.have.property('votes');
        done();
      });
    });
  });

  describe('GET /questions/:id', () => {
    it('should return a question by id', (done) => {
      chai.request(server)
      .get('/api/v1/questions/1001')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.id.should.equal(1001);
        response.body.title.should.equal('How do I convert a number to a string in JavaScript?');
        response.body.question.should.equal('I\'m trying to find the best way to convert a number to a string in JavaScript. Any thoughts would be great.');
        response.body.user_name.should.equal('Staci McWilliams');
        response.body.views.should.equal(15);
        response.body.answers.should.equal(1);
        response.body.votes.should.equal(7);
        response.body.title.should.equal('How do I convert a number to a string in JavaScript?');
        done();
      });
    });

    it('GET should return status 404 if id is not in database', (done) => {
      chai.request(server)
      .get('/api/v1/questions/60000')
      .end((error, response) => {
        response.should.have.status(404);
        response.should.be.json;
        done();
      });
    });
  });

  describe('GET /answers', () => {
    it('should return all questions', (done) => {
      chai.request(server)
      .get('/api/v1/answers')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.should.have.length(2);
        response.body[0].should.have.property('user_name');
        response.body[0].should.have.property('votes');
        response.body[0].should.have.property('question_id');
        done();
      });
    });
  });

  describe('GET /questions/:id/tags', () => {
    it('should return a tag by id', (done) => {
      chai.request(server)
      .get('/api/v1/questions/1001/tags')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.should.have.length(3);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('tag');
        done();
      });
    });

    it('should respond with a 404 warning if a GET is requested and there are no tags for that question_id', (done) => {
      chai.request(server)
      .get('/api/v1/questions/50000/tags')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });

  describe('POST /api/v1/questions', () => {
    it('should create a new questions', (done) => {
      chai.request(server)
      .post('/api/v1/questions')
      .send({
        title: 'Where do you put the script tag for JavaScript?',
        question: 'Where is the correct place to put the JavaScript tag in the HTML file?',
        user_name: 'Kyle Zucker',
        user_img: 'url_for_user_github_image',
        tags: ['JavaScript', 'React'],
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.id.should.equal(1);
        response.body.title.should.equal('Where do you put the script tag for JavaScript?');
        response.body.question.should.equal('Where is the correct place to put the JavaScript tag in the HTML file?');
        response.body.user_name.should.equal('Kyle Zucker');
        response.body.user_img.should.equal('url_for_user_github_image');
        chai.request(server)
        .get('/api/v1/questions/1')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.title.should.equal('Where do you put the script tag for JavaScript?');
          chai.request(server)
          .get('/api/v1/questions/1/tags')
          .end((err, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.have.length(2);
          });
          done();
        });
      });
    });

    it('should respond with a 422 warning if a Post is attempted without all the information', (done) => {
      chai.request(server)
      .post('/api/v1/questions')
      .send({
        title: 'Testing',
      })
      .end((error, response) => {
        response.should.have.status(422);
        done();
      });
    });
  });

  describe('POST /api/v1/answers', () => {
    it('should create a new answer', (done) => {
      chai.request(server)
      .post('/api/v1/answers')
      .send({
        answer: 'You should put it inside the body of your HTML file',
        question_id: '1001',
        user_name: 'Staci McWilliams',
        user_img: 'url_for_user_github_image',
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.should.have.property('answer');
        response.body.should.have.property('user_name');
        response.body.should.have.property('user_img');
        chai.request(server)
        .get('/api/v1/answers')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.should.have.length(3);
          done();
        });
      });
    });

    it('should respond with a 422 warning if a POST is attempted without all the information', (done) => {
      chai.request(server)
      .post('/api/v1/answers')
      .send({
        answer: 'Here you go',
      })
      .end((error, response) => {
        response.should.have.status(422);
        done();
      });
    });
  });

  describe('/api/v1/answers/:question_id', () => {
    it('should return an answer by question_id', (done) => {
      chai.request(server)
      .get('/api/v1/answers/1001')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a('array');
        response.body.should.have.length(1);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('answer');
        response.body[0].should.have.property('user_name');
        response.body[0].should.have.property('votes');
        done();
      });
    });
  });

  describe('PATCH /api/v1/questions/:id/votes', () => {
    it('should be able to PATCH a specific vote', (done) => {
      chai.request(server)
      .get('/api/v1/questions/1000')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.votes.should.equal(4);
      });
      chai.request(server)
      .patch('/api/v1/questions/1000')
      .query({
        value: 'up',
        counter: 'votes',
      })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.votes.should.equal(5);
        done();
      });
    });

    it('should be able to PATCH a specific answer', (done) => {
      chai.request(server)
      .get('/api/v1/questions/1000')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.answers.should.equal(1);
      });
      chai.request(server)
      .patch('/api/v1/questions/1000')
      .query({
        value: 'up',
        counter: 'answers',
      })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.answers.should.equal(2);
        done();
      });
    });

    it('should be able to PATCH a specific views', (done) => {
      chai.request(server)
      .get('/api/v1/questions/1000')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.views.should.equal(11);
      });
      chai.request(server)
      .patch('/api/v1/questions/1000')
      .query({
        value: 'up',
        counter: 'views',
      })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.views.should.equal(12);
        done();
      });
    });


    it('should respond with a 404 warning if a PATCH is attempted with an incorrect question id', (done) => {
      chai.request(server)
      .patch('/api/v1/questions/500000')
      .query({
        value: 'test',
        counter: 'votes',
      })
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });


  describe('GET /api/v1/search/:searchTerm', () => {
    it('should filter by search params', (done) => {
      chai.request(server)
      .get('/api/v1/questions')
      .end((error, response) => {
        response.body.should.have.length(2);
      });
      chai.request(server)
      .get('/api/v1/search/random')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.have.length(1);
        done();
      });
    });
  });
});
