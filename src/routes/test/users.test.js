const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const expect = chai.expect;

chai.use(chaiAsPromised);

const server = require('../../config/express');
const User = require('../../models/user.model');

describe('Users Endpoints', function () {
  before(async function () {
    // connect to test db
    await mongoose.connect(process.env.MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  });
  after(async function () {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /users', function () {
    it('should return 201 on success', async function () {
      await request(server)
        .post('/users')
        .send({
          login: 'kacperkaz',
          email: 'kacperkaz@example.com',
          password: 'asd'
        })
        .expect('Content-Type', new RegExp('application/json;'))
        .expect(201)
        .then((res) => {
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('id');
        });
    });
    context('if other users exist', function () {
      beforeEach(async function () {
        await User.deleteMany();
        await User.create({
          login: 'kacperkaz',
          email: 'kacperkaz@example.com',
          password: 'asd',
          role: 'user'
        });
      });
      afterEach(async function () {
        await User.deleteMany();
      });
      it('should return 400 if login is taken', async function () {
        await request(server)
          .post('/users')
          .send({
            login: 'kacperkaz',
            email: 'asd@example.com',
            password: 'asd'
          })
          .expect('Content-Type', new RegExp('application/json;'))
          .expect(400)
          .then((res) => {
            expect(res.body).to.have.property('message');
          });
      });
      it('should return 400 if email is taken', async function () {
        await request(server)
          .post('/users')
          .send({
            login: 'asd',
            email: 'kacperkaz@example.com',
            password: 'asd'
          })
          .expect('Content-Type', new RegExp('application/json;'))
          .expect(400)
          .then((res) => {
            expect(res.body).to.have.property('message');
          });
      });
    });
    it('should return 422 if login, email or password are missing', async function () {
      await request(server)
        .post('/users')
        .send({})
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
  });
  describe('POST /users/auth', function () {
    before(async function () {
      await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
    });

    it('should return 200 and tokens on success', async function () {
      //check login with username
      await request(server)
        .post('/users/auth')
        .send({ login: 'kacperkaz', password: 'asd' })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('access_token');
          expect(res.body).to.have.property('refresh_token');
        });
      //check login with email
      await request(server)
        .post('/users/auth')
        .send({ login: 'kacperkaz@example.com', password: 'asd' })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('access_token');
          expect(res.body).to.have.property('refresh_token');
        });
    });
    it('should return 422 if login or password are missing', async function () {
      await request(server)
        .post('/users/auth')
        .send()
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
    it('should return 400 if credentials are invalid', async function () {
      await request(server)
        .post('/users/auth')
        .send({ login: 'kacperkaz', password: 'qwerty' })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('POST /users/auth/refresh', function () {
    let user;
    beforeEach(async function () {
      await User.deleteMany({});
      //create logged in user
      user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh token
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      let refreshToken = jwt.sign(
        {
          login: user.login,
          email: user.email,
          id: user._id,
          role: user.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );

      user.refresh_token = refreshToken;
      user = await user.save();
    });
    afterEach(async function () {
      await User.deleteMany({});
    });

    it('should return 200 and new access token on success', async function () {
      await request(server)
        .post('/users/auth/refresh')
        .send({ token: user.refresh_token })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('access_token');
        });
    });
    it('should return 422 if no refresh token is present in the request body', async function () {
      await request(server)
        .post('/users/auth/refresh')
        .send()
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
    it('should return 400 if token is invalid', async function () {
      await request(server)
        .post('/users/auth/refresh')
        .send({ token: 'asd' })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 400 if user is not logged in', async function () {
      //delete access token from user
      let refreshToken = user.refresh_token;
      user.refresh_token = null;
      await user.save();

      await request(server)
        .post('/users/auth/refresh')
        .send({ token: refreshToken })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('POST /users/logout', function () {
    let user;
    beforeEach(async function () {
      await User.deleteMany({});
      //create logged in user
      user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh token
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      let refreshToken = jwt.sign(
        {
          login: user.login,
          email: user.email,
          id: user._id,
          role: user.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );

      user.refresh_token = refreshToken;
      user = await user.save();
    });
    afterEach(async function () {
      await User.deleteMany({});
    });

    it('should return 200 on success', async function () {
      await request(server)
        .post('/users/logout')
        .send({ token: user.refresh_token })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 422 if no token is present in the request body', async function () {
      await request(server)
        .post('/users/logout')
        .send()
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
    it('should return 400 if token is invalid', async function () {
      await request(server)
        .post('/users/logout')
        .send({ token: 'asd' })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 400 if user is not logged in', async function () {
      let refreshToken = user.refresh_token;
      user.refresh_token = null;
      await user.save();

      await request(server)
        .post('/users/logout')
        .send({ token: refreshToken })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('GET /users/:id', function () {
    let user1, user2;
    let accessToken;
    beforeEach(async function () {
      await User.deleteMany({});
      user1 = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      user2 = await User.create({
        login: 'asd',
        email: 'asd@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh tokens
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      refreshToken = jwt.sign(
        {
          login: user1.login,
          email: user1.email,
          id: user1._id,
          role: user1.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );
      user1.refresh_token = refreshToken;

      refreshToken = jwt.sign(
        {
          login: user2.login,
          email: user2.email,
          id: user2._id,
          role: user2.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );
      user2.refresh_token = refreshToken;

      //save refresh tokens
      user1 = await user1.save();
      user2 = await user2.save();
      // create access token
      const tokenTimestamp = Math.floor(Date.now() / 1000) + 15 * 60; // expires in 15 minutes
      const tokenExpDate = new Date(tokenTimestamp * 1000);

      accessToken = jwt.sign(
        {
          login: user1.login,
          email: user1.email,
          id: user1._id,
          role: user1.role,
          exp: tokenTimestamp
        },
        process.env.JWT_SECRET
      );
    });
    afterEach(async function () {
      User.deleteMany({});
    });

    it('should return 200 and user info on success', async function () {
      await request(server)
        .get(`/users/${user1._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('login');
        });
    });
    it('should return 401 if no Authorization header is present', async function () {
      await request(server)
        .get(`/users/${user1._id}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it("should return 403 if trying to access other user's info", async function () {
      await request(server)
        .get(`/users/${user2._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user does not exist', async function () {
      const id = mongoose.Types.ObjectId();

      await request(server)
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('PUT /users/:id', function () {
    let user1, user2;
    let accessToken;
    beforeEach(async function () {
      await User.deleteMany({});
      user1 = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      user2 = await User.create({
        login: 'asd',
        email: 'asd@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh tokens
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      refreshToken = jwt.sign(
        {
          login: user1.login,
          email: user1.email,
          id: user1._id,
          role: user1.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );
      user1.refresh_token = refreshToken;

      refreshToken = jwt.sign(
        {
          login: user2.login,
          email: user2.email,
          id: user2._id,
          role: user2.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );
      user2.refresh_token = refreshToken;

      //save refresh tokens
      user1 = await user1.save();
      user2 = await user2.save();
      // create access token
      const tokenTimestamp = Math.floor(Date.now() / 1000) + 15 * 60; // expires in 15 minutes
      const tokenExpDate = new Date(tokenTimestamp * 1000);

      accessToken = jwt.sign(
        {
          login: user1.login,
          email: user1.email,
          id: user1._id,
          role: user1.role,
          exp: tokenTimestamp
        },
        process.env.JWT_SECRET
      );
    });
    afterEach(async function () {
      User.deleteMany({});
    });

    it('should return 200 on success', async function () {
      await request(server)
        .put(`/users/${user1._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          login: 'newLogin'
        })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 400 if login is taken', async function () {
      await request(server)
        .put(`/users/${user1._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          login: 'asd'
        })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 401 if user is not logged in', async function () {
      //delete refresh token from db
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .put(`/users/${user1._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          login: 'newLogin'
        })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it("should return 403 if trying to change other user's info", async function () {
      await request(server)
        .put(`/users/${user2._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          login: 'newLogin'
        })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user does not exist', async function () {
      let id = mongoose.Types.ObjectId();
      await request(server)
        .put(`/users/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          login: 'newLogin'
        })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 422 if no data is provided', async function () {
      await request(server)
        .put(`/users/${user1._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
  });
  describe('PUT /users/:id/login', function () {
    let user1, user2;
    let accessToken;
    beforeEach(async function () {
      await User.deleteMany({});
      user1 = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      user2 = await User.create({
        login: 'asd',
        email: 'asd@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh tokens
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      refreshToken = jwt.sign(
        {
          login: user1.login,
          email: user1.email,
          id: user1._id,
          role: user1.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );
      user1.refresh_token = refreshToken;

      refreshToken = jwt.sign(
        {
          login: user2.login,
          email: user2.email,
          id: user2._id,
          role: user2.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );
      user2.refresh_token = refreshToken;

      //save refresh tokens
      user1 = await user1.save();
      user2 = await user2.save();
      // create access token
      const tokenTimestamp = Math.floor(Date.now() / 1000) + 15 * 60; // expires in 15 minutes
      const tokenExpDate = new Date(tokenTimestamp * 1000);

      accessToken = jwt.sign(
        {
          login: user1.login,
          email: user1.email,
          id: user1._id,
          role: user1.role,
          exp: tokenTimestamp
        },
        process.env.JWT_SECRET
      );
    });
    afterEach(async function () {
      User.deleteMany({});
    });

    it('should return 200 on success', async function () {
      await request(server)
        .put(`/users/${user1._id}/login`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ login: 'newLogin' })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'));
    });
    it('should return 400 if login is taken', async function () {
      await request(server)
        .put(`/users/${user1._id}/login`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ login: 'asd' })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 401 if user is not logged in', async function () {
      //delete refresh token from database
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .put(`/users/${user1._id}/login`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ login: 'asd' })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it("should return 403 if trying to change other user's login", async function () {
      await request(server)
        .put(`/users/${user2._id}/login`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ login: 'asd' })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user does not exist', async function () {
      let id = mongoose.Types.ObjectId();

      await request(server)
        .put(`/users/${id}/login`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ login: 'asd' })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 422 if no login is present in the request', async function () {
      await request(server)
        .put(`/users/${user1._id}/login`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
  });
});
