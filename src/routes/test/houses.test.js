const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const expect = chai.expect;

chai.use(chaiAsPromised);

const server = require('../../config/express');

const User = require('../../models/user.model');
const House = require('../../models/house.model');
const Room = require('../../models/room.model');
const Item = require('../../models/item.model');

describe('Houses Endpoints', function () {
  before(async function () {
    // connect to test db
    await mongoose.connect(process.env.MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  });
  after(async function () {
    await mongoose.connection.close();
  });
  let user1, user2;
  let accessToken, accessToken2; //access tokens for user 1 and 2
  let refreshToken;
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
  });
  afterEach(async function () {
    await User.deleteMany({});
    await House.deleteMany({});
    await Room.deleteMany({});
  });

  describe('POST /houses', function () {
    it('should return 201 on success', async function () {
      await request(server)
        .post('/houses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'house', description: 'description' })
        .expect(201)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('id');
        });
    });
    context('if user is not logged in', function () {
      beforeEach(async function () {
        refreshToken = user1.refresh_token;
        user1.refresh_token = null;
        await user1.save();
      });
      afterEach(async function () {
        user1.refresh_token = refreshToken;
        await user1.save();
      });

      it('should return 401 if user is not logged in', async function () {
        await request(server)
          .post('/houses')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ name: 'house', description: 'description' })
          .expect(401)
          .expect('Content-Type', new RegExp('application/json;'))
          .then((res) => {
            expect(res.body).to.have.property('message');
          });
      });
    });
    it('should return 401 if Authorization header is not present', async function () {
      await request(server)
        .post('/houses')
        .send({ name: 'house', description: 'description' })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 422 if name is not provided', async function () {
      await request(server)
        .post('/houses')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
  });
  describe('POST /houses/:id/rooms', function () {
    let house;
    beforeEach(async function () {
      house = await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should return 201 on success', async function () {
      await request(server)
        .post(`/houses/${house._id}/rooms`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'room', description: 'room description' })
        .expect(201)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('id');
        });
    });
    it('should throw 401 if user is not logged in', async function () {
      refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .post(`/houses/${house._id}/rooms`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'room', description: 'room description' })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should throw 401 is no Authorization header is present', async function () {
      await request(server)
        .post(`/houses/${house._id}/rooms`)
        .send({ name: 'room', description: 'room description' })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it("should throw 403 if trying to create a room in someone else's house", async function () {
      await request(server)
        .post(`/houses/${house._id}/rooms`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ name: 'room', description: 'room description' })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 404 if no house with provided id is found', async function () {
      await request(server)
        .post(`/houses/${mongoose.Types.ObjectId()}/rooms`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'room', description: 'room description' })
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should throw 422 if name is not provided', async function () {
      await request(server)
        .post(`/houses/${house._id}/rooms`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ description: 'room description' })
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
  });
  describe('POST /houses/:id/collaborators', function () {
    let house;
    beforeEach(async function () {
      house = await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should return 200 when user email is provided', async function () {
      await request(server)
        .post(`/houses/${house._id}/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: user2.email })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 200 when user login is provided', async function () {
      await request(server)
        .post(`/houses/${house._id}/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: user2.login })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 400 if no user with provided login/email exist', async function () {
      await request(server)
        .post(`/houses/${house._id}/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'nonExistentUserLogin' })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 400 if owner is trying to add himself as a collaborator', async function () {
      await request(server)
        .post(`/houses/${house._id}/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: user1.email })
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
        .post(`/houses/${house._id}/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: user2.email })
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
        .post(`/houses/${house._id}/collaborators`)
        .send({ name: user2.email })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user is not an owner of the house', async function () {
      await request(server)
        .post(`/houses/${house._id}/collaborators`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ name: user2.email })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 404 if no house with provided id is found', async function () {
      await request(server)
        .post(`/houses/${mongoose.Types.ObjectId()}/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: user2.login })
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 422 if no name field is provided in the request', async function () {
      await request(server)
        .post(`/houses/${house._id}/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
  });
  describe('PUT /houses/:id', function () {
    let house;
    beforeEach(async function () {
      house = await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should return 200 on success', async function () {
      await request(server)
        .put(`/houses/${house._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'new house name', description: 'new house description' })
        .expect(200)
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
        .put(`/houses/${house._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'new house name', description: 'new house description' })
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
        .put(`/houses/${house._id}`)
        .send({ name: 'new house name', description: 'new house description' })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user in not an owner of the house', async function () {
      await request(server)
        .put(`/houses/${house._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ name: 'new house name', description: 'new house description' })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 404 if no house with provided id is found', async function () {
      await request(server)
        .put(`/houses/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'new house name', description: 'new house description' })
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 422 if no name is provided in the request', async function () {
      await request(server)
        .put(`/houses/${house._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
  });
  describe('GET /houses', function () {
    beforeEach(async function () {
      await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id
      });
      await House.create({
        name: 'house 2',
        description: 'house description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should return 200 and array of houses on success', async function () {
      await request(server)
        .get(`/houses`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('array').of.length(2);
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('description');
        });
    });
    it('should return 401 if user is not logged in', async function () {
      refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .get(`/houses`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
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
        .get(`/houses`)
        .send()
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('GET /houses/:id', function () {
    let house, house2;
    beforeEach(async function () {
      house = await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id,
        collaborators: [user2._id]
      });
      house2 = await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should return 200 and a house on success', async function () {
      await request(server)
        .get(`/houses/${house.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('object');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('description');
        });
    });
    it('should return 400 if house id is invalid', async function () {
      await request(server)
        .get(`/houses/asd`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
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
        .get(`/houses/${house._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
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
        .get(`/houses/${house._id}`)
        .send()
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user is not a house owner or collaborator', async function () {
      await request(server)
        .get(`/houses/${house2._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send()
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 404 if no house with provided id is found', async function () {
      await request(server)
        .get(`/houses/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('GET /houses/:id/storage', function () {
    let house, house2;
    beforeEach(async function () {
      await Item.deleteMany({});
      await Room.deleteMany({});
      await House.deleteMany({});

      house = await House.create({
        name: 'house name',
        owner: user1._id,
        collaborators: [user2._id]
      });
      house2 = await House.create({
        name: 'house2 name',
        owner: user1._id
      });

      let item = await Item.create({ name: 'item name', owner: user1._id });
      let item2 = await Item.create({ name: 'item2 name', owner: user1._id });

      let room = await Room.create({
        name: 'room name',
        house: house._id,
        storage: [
          { item: item._id, quantity: 1 },
          { item: item2._id, quantity: 4 }
        ]
      });
      let room2 = await Room.create({
        name: 'room name',
        house: house2._id,
        storage: [
          { item: item._id, quantity: 1 },
          { item: item2._id, quantity: 4 }
        ]
      });
      let room3 = await Room.create({
        name: 'room name',
        house: house2._id,
        storage: [
          { item: item2._id, quantity: 1 },
          { item: item._id, quantity: 4 }
        ]
      });

      house.rooms = [room];
      house = await house.save();

      house2.rooms = [room2, room3];
      house2 = await house2.save();
    });
    afterEach(async function () {
      await Item.deleteMany({});
      await Room.deleteMany({});
      await House.deleteMany({});
    });

    it('should return 200 and storage items array for a house owner', async function () {
      await request(server)
        .get(`/houses/${house2._id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('array').of.length(4);
        });
      await request(server)
        .get(`/houses/${house2._id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ name: 'item2' })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('array').of.length(2);
        });
    });
    it('should return 200 and storage items array for a house collaborator', async function () {
      await request(server)
        .get(`/houses/${house._id}/storage`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('array').of.length(2);
        });
      await request(server)
        .get(`/houses/${house._id}/storage`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .query({ name: 'item2' })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('array').of.length(1);
        });
    });
    it('should return 400 if house id is invalid', async function () {
      await request(server)
        .get(`/houses/asd/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should return 401 if user is not logged in', async function () {
      refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .get(`/houses/${house2._id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should return 401 if no Authorization header is present', async function () {
      await request(server)
        .get(`/houses/${house._id}/storage`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should return 403 if user is not a house owner nor a collaborator', async function () {
      await request(server)
        .get(`/houses/${house2._id}/storage`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should return 404 if house does not exist', async function () {
      await request(server)
        .get(`/houses/${mongoose.Types.ObjectId()}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
  });
  describe('GET /houses/:id/collaborators', function () {
    let house, house2;
    beforeEach(async function () {
      house = await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id,
        collaborators: [user2._id]
      });
      house2 = await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should return 200 and array of collaborators on success', async function () {
      await request(server)
        .get(`/houses/${house._id}/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('array').of.length(1);
          expect(res.body[0]).to.have.property('_id');
          expect(res.body[0]).to.have.property('login');
        });
    });
    it('should return 400 is house id in invalid', async function () {
      await request(server)
        .get(`/houses/asd/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
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
        .get(`/houses/${house._id}/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should return 401 if no Authorization header is present in request', async function () {
      await request(server)
        .get(`/houses/${house._id}/collaborators`)
        .send()
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user is not an owner nor a collaborator', async function () {
      await request(server)
        .get(`/houses/${house2._id}/collaborators`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send()
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 404 if no house with provided id is found', async function () {
      await request(server)
        .get(`/houses/${mongoose.Types.ObjectId()}/collaborators`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('GET /houses/:id/rooms', function () {
    let house;
    beforeEach(async function () {
      house = await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id
      });
      let room = await Room.create({
        name: 'room',
        description: 'room description',
        house: house._id
      });

      house.rooms = [room._id];
      await house.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
    });

    it('should return 200 and array of rooms on success', async function () {
      await request(server)
        .get(`/houses/${house._id}/rooms`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('array').of.length(1);
          expect(res.body[0]).to.have.property('name', 'room');
          expect(res.body[0]).to.have.property(
            'description',
            'room description'
          );
        });
    });
    it('should return 400 is house id in invalid', async function () {
      await request(server)
        .get(`/houses/asd/rooms`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.has.property('message');
        });
    });
    it('should return 401 if user is not logged in', async function () {
      refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .get(`/houses/${house._id}/rooms`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.has.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should return 401 if no Authorization header is present in request', async function () {
      await request(server)
        .get(`/houses/${house._id}/rooms`)
        .send()
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.has.property('message');
        });
    });
    it('should return 403 if user is not an owner nor a collaborator', async function () {
      await request(server)
        .get(`/houses/${house._id}/rooms`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send()
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.has.property('message');
        });
    });
    it('should return 404 if no house with provided id is found', async function () {
      await request(server)
        .get(`/houses/${mongoose.Types.ObjectId()}/rooms`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.has.property('message');
        });
    });
  });
  describe('DELETE /houses/:id', function () {
    let house;
    beforeEach(async function () {
      house = await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should return 200 on success', async function () {
      await request(server)
        .delete(`/houses/${house._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 400 if house id is invalid', async function () {
      await request(server)
        .delete(`/houses/asd`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
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
        .delete(`/houses/${house._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });

      user1.refresh_token = refreshToken;
      user1.save();
    });
    it('should return 401 if Authorization header is missing', async function () {
      await request(server)
        .delete(`/houses/${house._id}`)
        .send()
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user is not an owner nor a collaborator', async function () {
      await request(server)
        .delete(`/houses/${house._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send()
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 404 if house with provided id does not exist', async function () {
      await request(server)
        .delete(`/houses/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('DELETE /houses/:id/collaborators/:userId', function () {
    let house, collaboratorId;
    beforeEach(async function () {
      house = await House.create({
        name: 'house',
        description: 'house description',
        owner: user1._id,
        collaborators: [user2._id]
      });
      collaboratorId = user2._id;
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should return 200 on success', async function () {
      await request(server)
        .delete(`/houses/${house._id}/collaborators/${collaboratorId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 400 if house id is invalid', async function () {
      await request(server)
        .delete(`/houses/asd/collaborators/${collaboratorId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
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
        .delete(`/houses/${house._id}/collaborators/${collaboratorId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });

      user1.refresh_token = refreshToken;
      user1.save();
    });
    it('should return 401 if Authorization header is missing', async function () {
      await request(server)
        .delete(`/houses/${house._id}/collaborators/${collaboratorId}`)
        .send()
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 403 if user is not an owner', async function () {
      await request(server)
        .delete(`/houses/${house._id}/collaborators/${collaboratorId}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send()
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('should return 404 if house with provided id does not exist', async function () {
      await request(server)
        .delete(
          `/houses/${mongoose.Types.ObjectId()}/collaborators/${collaboratorId}`
        )
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
  });
});
