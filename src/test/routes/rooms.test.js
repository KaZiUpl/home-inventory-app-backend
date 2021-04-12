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
const Item = require('../../models/item.model');

describe('Rooms Endpoints', function () {
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

  describe('POST /rooms/:id/storage', function () {
    let item, item2, item3, room3, room4;
    beforeEach(async function () {
      await Item.deleteMany({});
      item = await Item.create({ name: 'item', owner: user1._id });
      item2 = await Item.create({ name: 'item 2', owner: user2._id });
      item3 = await Item.create({
        name: 'item3',
        owner: mongoose.Types.ObjectId()
      });

      let user3 = await User.create({
        login: 'user3',
        email: 'user3@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      // requesting user is the house owner and item owner is a collaborator
      let house3 = await House.create({
        name: 'house3',
        owner: user2._id,
        collaborators: [user1._id]
      });
      room3 = await Room.create({
        name: 'room3',
        description: 'description1',
        house: house3._id
      });
      house3.rooms = [room3._id];
      await house3.save();
      // both requesting user and item owner are collaborators
      let house4 = await House.create({
        name: 'house4',
        owner: user3._id,
        collaborators: [user1._id, user2._id]
      });
      room4 = await Room.create({
        name: 'room4',
        description: 'description1',
        house: house4._id
      });
      house4.rooms = [room4._id];
      await house4.save();
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it('should return 200 if house owner is adding new storage item', async function () {
      await request(server)
        .post(`/rooms/${room.id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          item: item._id,
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
          expect(res.body).to.exist.and.to.have.property('id');
        });
    });
    it('should return 200 if house collaborator is adding new storage item', async function () {
      await request(server)
        .post(`/rooms/${room.id}/storage`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({
          item: item2._id,
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
          expect(res.body).to.exist.and.to.have.property('id');
        });
    });
    it("should return 200 if both item's owner and requesting user have access to a house (owner + collaborator or 2 collaborators)", async function () {
      // item owner is a house owner and requesting user is a collaborator
      await request(server)
        .post(`/rooms/${room.id}/storage`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({
          item: item._id,
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
          expect(res.body).to.exist.and.to.have.property('id');
        });

      //item owner is a collaborator and requesting user is a house owner
      await request(server)
        .post(`/rooms/${room3.id}/storage`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({
          item: item._id,
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
          expect(res.body).to.exist.and.to.have.property('id');
        });

      //both item owner and requesting user are collaborators
      await request(server)
        .post(`/rooms/${room4.id}/storage`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({
          item: item._id,
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
          expect(res.body).to.exist.and.to.have.property('id');
        });
    });
    it('should throw 400 if room id is invalid', async function () {
      await request(server)
        .post(`/rooms/asd/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          item: item._id,
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 400 if item id is invalid', async function () {
      await request(server)
        .post(`/rooms/${room.id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          item: 'asd',
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 400 if quantity is less than 1', async function () {
      await request(server)
        .post(`/rooms/${room.id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          item: item._id,
          quantity: -1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 400 if expiration is not a timestamp', async function () {
      await request(server)
        .post(`/rooms/${room.id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          item: item._id,
          quantity: 1,
          expiration: 'asd',
          description: 'desc'
        })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 401 if user is not logged in', async function () {
      let refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .post(`/rooms/${room.id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          item: item._id,
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should throw 401 if no Authorization header is present', async function () {
      await request(server)
        .post(`/rooms/${room.id}/storage`)
        .send({
          item: item._id,
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 403 if user is not a house owner nor a collaborator', async function () {
      await request(server)
        .post(`/rooms/${room2.id}/storage`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({
          item: item2._id,
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 404 if room does not exist', async function () {
      await request(server)
        .post(`/rooms/${mongoose.Types.ObjectId()}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          item: item._id,
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 404 if item does not exist', async function () {
      await request(server)
        .post(`/rooms/${room.id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          item: mongoose.Types.ObjectId(),
          quantity: 1,
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 422 if item id or quantity is not provided', async function () {
      await request(server)
        .post(`/rooms/${room.id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          expiration: Date.now(),
          description: 'desc'
        })
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
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
    it('should throw 404 if no room with provided id was found', async function () {
      await request(server)
        .put(`/rooms/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ name: 'new room1 name', description: 'new room1 description' })
        .expect(404)
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
          expect(res.body).to.exist.and.to.be.a('array');
        });
    });
  });
  describe('PUT /rooms/:roomId/storage/:storageId', function () {
    let item, storageItem, storageItem2;
    beforeEach(async function () {
      await Item.deleteMany({});
      item = await Item.create({ name: 'item', owner: user1._id });

      storageItem = await room.storage.create({
        item: item._id,
        quantity: 1
      });
      room.storage.push(storageItem);
      await room.save();

      storageItem2 = room2.storage.create({ item: item._id, quantity: 1 });
      room2.storage.push(storageItem2);
      await room2.save();
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it('should return 200 for house owner', async function () {
      await request(server)
        .put(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ quantity: 2, description: 'asd', expiration: Date.now() })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should return 200 for house collaborator', async function () {
      await request(server)
        .put(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ quantity: 2, description: 'asd', expiration: Date.now() })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 400 if quantity is less than 1', async function () {
      await request(server)
        .put(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ quantity: 0, description: 'asd', expiration: Date.now() })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 400 if room id is invalid', async function () {
      await request(server)
        .put(`/rooms/asd/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ quantity: 2, description: 'asd', expiration: Date.now() })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 400 if storage item id is invalid', async function () {
      await request(server)
        .put(`/rooms/${room._id}/storage/asd`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ quantity: 2, description: 'asd', expiration: Date.now() })
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 401 if user is not logged in', async function () {
      refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .put(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ quantity: 2, description: 'asd', expiration: Date.now() })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should throw 401 if no Authorization header is present', async function () {
      await request(server)
        .put(`/rooms/${room._id}/storage/${storageItem._id}`)
        .send({ quantity: 2, description: 'asd', expiration: Date.now() })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 403 if user is not a house owner nor a collaborator', async function () {
      await request(server)
        .put(`/rooms/${room2._id}/storage/${storageItem2._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ quantity: 2, description: 'asd', expiration: Date.now() })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 404 if room is not found', async function () {
      await request(server)
        .put(`/rooms/${mongoose.Types.ObjectId()}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ quantity: 2, description: 'asd', expiration: Date.now() })
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 404 if storage item is not found', async function () {
      await request(server)
        .put(`/rooms/${room._id}/storage/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ quantity: 2, description: 'asd', expiration: Date.now() })
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 422 if no quantity is provided', async function () {
      await request(server)
        .put(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ description: 'asd', expiration: Date.now() })
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.be.a('array');
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
  describe('GET /rooms/:id/storage', function () {
    let item, item2;
    beforeEach(async function () {
      await Item.deleteMany({});
      item = await Item.create({ name: 'item', owner: user1._id });
      item2 = await Item.create({ name: 'item 2', owner: user2._id });

      let storageItem = await room.storage.create({
        item: item._id,
        quantity: 1
      });
      let storageItem2 = await room.storage.create({
        item: item2._id,
        quantity: 1
      });
      room.storage.push(storageItem);
      room.storage.push(storageItem2);
      await room.save();

      storageItem = room2.storage.create({ item: item._id, quantity: 1 });
      room2.storage.push(storageItem);
      await room2.save();
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it('should return 200 and room storage for a house owner', async function () {
      await request(server)
        .get(`/rooms/${room._id}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('array');
        });
    });
    it('should return 200 and room storage for a house collaborator', async function () {
      await request(server)
        .get(`/rooms/${room._id}/storage`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('array');
        });
    });
    it('should return 400 if room id is invalid', async function () {
      await request(server)
        .get(`/rooms/asd/storage`)
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
        .get(`/rooms/${room._id}/storage`)
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
        .get(`/rooms/${room._id}/storage`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should return 403 if user is not a house owner nor a collaborator', async function () {
      await request(server)
        .get(`/rooms/${room2._id}/storage`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should return 404 if room does not exist', async function () {
      await request(server)
        .get(`/rooms/${mongoose.Types.ObjectId()}/storage`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
  });
  describe('GET /rooms/:roomId/storage/:storageId', function () {
    let item, storageItem, storageItem2;
    beforeEach(async function () {
      await Item.deleteMany({});
      item = await Item.create({ name: 'item', owner: user1._id });

      storageItem = await room.storage.create({
        item: item._id,
        quantity: 1
      });
      room.storage.push(storageItem);
      await room.save();

      storageItem2 = room2.storage.create({ item: item._id, quantity: 1 });
      room2.storage.push(storageItem2);
      await room2.save();
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it('should return 200 and storage item for a house owner', async function () {
      await request(server)
        .get(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('object');
        });
    });
    it('should return 200 and storage item for a house collaborator', async function () {
      await request(server)
        .get(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('object');
        });
    });
    it('should throw 400 if room id is invalid', async function () {
      await request(server)
        .get(`/rooms/asd/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 400 if storage item id is invalid', async function () {
      await request(server)
        .get(`/rooms/${room._id}/storage/asd`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 401 if user is not logged in', async function () {
      refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .get(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should throw 401 if no Authorization header is present', async function () {
      await request(server)
        .get(`/rooms/${room._id}/storage/${storageItem._id}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 403 if user if not a house owner nor a collaborator', async function () {
      await request(server)
        .get(`/rooms/${room2._id}/storage/${storageItem2._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 404 if no room with provided id is found', async function () {
      await request(server)
        .get(`/rooms/${mongoose.Types.ObjectId()}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 404 if no storage item with provided id is found', async function () {
      await request(server)
        .get(`/rooms/${room._id}/storage/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
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
  describe('DELETE /rooms/:roomId/storage/:storageId', function () {
    let item, storageItem, storageItem2;
    beforeEach(async function () {
      await Item.deleteMany({});
      item = await Item.create({ name: 'item', owner: user1._id });

      storageItem = await room.storage.create({
        item: item._id,
        quantity: 1
      });
      room.storage.push(storageItem);
      await room.save();

      storageItem2 = room2.storage.create({ item: item._id, quantity: 1 });
      room2.storage.push(storageItem2);
      await room2.save();
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it('should return 200 if user is house owner', async function () {
      await request(server)
        .delete(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should return 200 if user is house collaborator', async function () {
      await request(server)
        .delete(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 400 if room id is invalid', async function () {
      await request(server)
        .delete(`/rooms/asd/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 400 if storage item id is invalid', async function () {
      await request(server)
        .delete(`/rooms/${room._id}/storage/asd`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 401 if user is not logged in', async function () {
      refreshToken = user1.refresh_token;
      user1.refresh_token = null;
      await user1.save();

      await request(server)
        .delete(`/rooms/${room._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });

      user1.refresh_token = refreshToken;
      await user1.save();
    });
    it('should throw 401 if no Authorization header is present', async function () {
      await request(server)
        .delete(`/rooms/${room._id}/storage/${storageItem._id}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 403 if user is not a house owner nor a collaborator', async function () {
      await request(server)
        .delete(`/rooms/${room2._id}/storage/${storageItem._id}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 404 if room is not found', async function () {
      await request(server)
        .delete(
          `/rooms/${mongoose.Types.ObjectId()}/storage/${storageItem._id}`
        )
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
    it('should throw 404 if storage item is not found', async function () {
      await request(server)
        .delete(`/rooms/${room._id}/storage/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.have.property('message');
        });
    });
  });
});
