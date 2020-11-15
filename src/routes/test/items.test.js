const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const expect = chai.expect;

chai.use(chaiAsPromised);

const server = require('../../config/express');
const User = require('../../models/user.model');
const Item = require('../../models/item.model');

describe('Items Endpoints', function () {
  let user, accessToken;
  before(async function () {
    await mongoose.connect(process.env.MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    await Item.deleteMany({});
    await User.deleteMany({});
    user = await User.create({
      login: 'asd',
      email: 'asd@example.com',
      password: 'asd',
      role: 'user'
    });

    const refreshTokenTimestamp =
      Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
    refreshToken = jwt.sign(
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
    // create access token for user1
    const tokenTimestamp = Math.floor(Date.now() / 1000) + 15 * 60; // expires in 15 minutes

    accessToken = jwt.sign(
      {
        login: user.login,
        email: user.email,
        id: user._id,
        role: user.role,
        exp: tokenTimestamp
      },
      process.env.JWT_SECRET
    );
  });
  after(async function () {
    await Item.deleteMany({});
    await User.deleteMany({});

    await mongoose.connection.close();
  });
  beforeEach(async function () {
    await Item.deleteMany({});
  });
  afterEach(async function () {
    await Item.deleteMany({});
  });

  describe('POST /items', function () {
    it('should return 201 and item id on success', async function () {
      await request(server)
        .post('/items')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'item' })
        .expect(201)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('id').be.a('string');
        });
    });
    it('should throw 401 if user is not logged in', async function () {
      let refreshToken = user.refresh_token;
      user.refresh_token = null;
      await user.save();

      await request(server)
        .post('/items')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'item' })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('message');
        });

      user.refresh_token = refreshToken;
      await user.save();
    });
    it('should throw 401 if no Authorization header is present', async function () {
      await request(server)
        .post('/items')
        .send({ name: 'item' })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('message');
        });
    });
    it('should throw 422 if no item data is provided', async function () {
      await request(server)
        .post('/items')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('GET /items/:id', function () {});
  describe('GET /items', function () {});
  describe('PUT /items/:id', function () {});
  describe('DELETE /items/:id', function () {});
});
