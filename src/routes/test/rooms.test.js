const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const expect = chai.expect;

chai.use(chaiAsPromised);

const server = require('../../config/express');

const User = require('../../models/user.model');
const House = require('../../models/house.model');
const Room = require('../../models/room.model');

describe('/rooms', function () {
  let user1, user2;
  let accessToken, accessToken2; //access tokens for user 1 and 2
  let refreshToken;
  let house, house2, room, room2;
  before(async function () {
    // connect to test db
    await mongoose.connect(process.env.MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  });
  after(async function () {
    //close the connection
    await mongoose.connection.close();
  });
  beforeEach(async function () {
    await User.deleteMany({});
    await House.deleteMany({});
    await Room.deleteMany({});
    //create test users
    user1 = await User.create({
      login: 'kacperkaz',
      email: 'kacperkaz@example.com',
      password: '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
      role: 'user'
    });
    user2 = await User.create({
      login: 'asd',
      email: 'asd@example.com',
      password: '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
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
    // create access token for user1
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
    accessToken2 = jwt.sign(
      {
        login: user2.login,
        email: user2.email,
        id: user2._id,
        role: user2.role,
        exp: tokenTimestamp
      },
      process.env.JWT_SECRET
    );

    //create room with a collaborator
    house = await House.create({
      name: 'house1',
      owner: user1._id,
      collaborators: [user2._id]
    });
    room = await Room.create({
      name: 'room1',
      description: 'description1',
      house: house._id
    });
    house.rooms = [room._id];
    await house.save();
    //create room without a collaborator
    house2 = await House.create({
      name: 'house1',
      owner: user1._id
    });
    room2 = await Room.create({
      name: 'room2',
      description: 'description2',
      house: house2._id
    });
    house2.rooms = [room2._id];
    await house2.save();
  });
  afterEach(async function () {
    await User.deleteMany({});
    await House.deleteMany({});
    await Room.deleteMany({});
  });

  describe('PUT /rooms/:id', function () {
    it('should return 200 on success', async function () {
      await request(server)
        .put(`/rooms/${room._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'new room1 name', description: 'new room1 description' })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should throw 401 if user is not logged in', async function () {
      refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .put(`/rooms/${room._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'new room1 name', description: 'new room1 description' })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should throw 401 if no Authorization header is present', async function () {
      await request(server)
        .put(`/rooms/${room._id}`)
        .send({ name: 'new room1 name', description: 'new room1 description' })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should throw 403 if user is not an owner of the house', async function () {
      await request(server)
        .put(`/rooms/${room2._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ name: 'new room1 name', description: 'new room1 description' })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should throw 422 if no name nor description is provided', async function () {
      await request(server)
        .put(`/rooms/${room._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('GET /rooms/:id', function () {
    it('should return 200 and room info', async function () {
      await request(server)
        .get(`/rooms/${room._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('name', 'room1');
          expect(res.body).to.have.property('description', 'description1');
          expect(res.body).to.have.property('_id', room._id.toString());
        });
    });
    it('should throw 400 if room id is invalid', async function () {
      await request(server)
        .get(`/rooms/asd`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 401 if user is not logged in', async function () {
      refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .get(`/rooms/${room._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should return 401 if no Authorization header is present', async function () {
      await request(server)
        .get(`/rooms/${room._id}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user is not an owner nor a collaborator of the house', async function () {
      await request(server)
        .get(`/rooms/${room2._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should throw 404 if no room with provided id was found', async function () {
      await request(server)
        .get(`/rooms/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('DELETE /rooms/:id', function () {
    it('should return 200 on success', async function () {
      await request(server)
        .delete(`/rooms/${room._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 400 if id is invalid', async function () {
      await request(server)
        .delete(`/rooms/asd`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 401 if user is not logged in', async function () {
      refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .delete(`/rooms/${room._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should return 401 if no Authorization header is present', async function () {
      await request(server)
        .delete(`/rooms/${room._id}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user is not a house owner', async function () {
      await request(server)
        .delete(`/rooms/${room._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 404 if no room with provided id was found', async function () {
      await request(server)
        .delete(`/rooms/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
});
