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
  describe('GET /items/:id', function () {
    let globalItem, userItem, otherUserItem;
    beforeEach(async function () {
      globalItem = await Item.create({
        name: 'global item',
        description: 'global item description',
        manufacturer: 'manufacturer'
      });
      userItem = await Item.create({
        name: 'user item',
        description: 'user item description',
        manufacturer: 'manufacturer',
        owner: user._id
      });
      otherUserItem = await Item.create({
        name: 'user item',
        description: 'user item description',
        manufacturer: 'manufacturer',
        owner: mongoose.Types.ObjectId()
      });
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it("should return 200 and user's item", async function () {
      await request(server)
        .get(`/items/${userItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('name', 'user item');
          expect(res.body).to.have.property(
            'description',
            'user item description'
          );
          expect(res.body).to.have.property('manufacturer', 'manufacturer');
        });
    });
    it('should return 200 and global item', async function () {
      await request(server)
        .get(`/items/${globalItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('name', 'global item');
          expect(res.body).to.have.property(
            'description',
            'global item description'
          );
          expect(res.body).to.have.property('manufacturer', 'manufacturer');
        });
    });
    it('should throw 400 if item id is invalid', async function () {
      await request(server)
        .get(`/items/asd`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('message');
        });
    });
    it('should throw 401 if user is not logged in', async function () {
      let refreshToken = user.refresh_token;
      user.refresh_token = null;
      await user.save();

      await request(server)
        .get(`/items/${userItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
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
        .get(`/items/${userItem._id}`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('message');
        });
    });
    it("should throw 403 if trying to access other user's item", async function () {
      await request(server)
        .get(`/items/${otherUserItem._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('message');
        });
    });
    it('should throw 404 if item does not exist', async function () {
      await request(server)
        .get(`/items/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('GET /items', function () {
    let globalItem, userItem, otherUserItem;
    beforeEach(async function () {
      globalItem = await Item.create({
        name: 'global item',
        description: 'global item description',
        manufacturer: 'manufacturer'
      });
      userItem = await Item.create({
        name: 'user item',
        description: 'user item description',
        manufacturer: 'manufacturer',
        owner: user._id
      });
      otherUserItem = await Item.create({
        name: 'user item',
        description: 'user item description',
        manufacturer: 'manufacturer',
        owner: mongoose.Types.ObjectId()
      });
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it("should return 200 and array of user's and global items", async function () {
      await request(server)
        .get(`/items`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.be.a('array').of.length(2);
          expect(res.body[0]).to.have.property('_id');
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('description');
          expect(res.body[0]).to.have.property('manufacturer');
        });
    });
    it('should throw 401 if user is not logged in', async function () {
      let refreshToken = user.refresh_token;
      user.refresh_token = null;
      await user.save();

      await request(server)
        .get(`/items`)
        .set('Authorization', `Bearer ${accessToken}`)
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
        .get(`/items`)
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist;
          expect(res.body).to.have.property('message');
        });
    });
  });
  describe('PUT /items/:id', function () {
    let item, item2;
    beforeEach(async function () {
      await Item.deleteMany({});
      item = await Item.create({
        name: 'item name',
        description: 'item description',
        manufacturer: 'manufacturer',
        owner: user._id
      });
      item2 = await Item.create({
        name: 'item name',
        description: 'item description',
        manufacturer: 'manufacturer',
        owner: mongoose.Types.ObjectId()
      });
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it('should return 200 on success', async function () {
      await request(server)
        .put(`/items/${item._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'new item name',
          description: 'new item description',
          manufacturer: 'new manufacturer'
        })
        .expect(200)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 401 if user is not logged in', async function () {
      let refreshToken = user.refresh_token;
      user.refresh_token = null;
      await user.save();

      await request(server)
        .put(`/items/${item._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'new item name',
          description: 'new item description',
          manufacturer: 'new manufacturer'
        })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });

      user.refresh_token = refreshToken;
      await user.save();
    });
    it('should throw 401 if no Authorization header is present', async function () {
      await request(server)
        .put(`/items/${item._id}`)
        .send({
          name: 'new item name',
          description: 'new item description',
          manufacturer: 'new manufacturer'
        })
        .expect(401)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 403 if user is not an owner of the item', async function () {
      await request(server)
        .put(`/items/${item2._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'new item name',
          description: 'new item description',
          manufacturer: 'new manufacturer'
        })
        .expect(403)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 404 if item does not exist', async function () {
      await request(server)
        .put(`/items/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'new item name',
          description: 'new item description',
          manufacturer: 'new manufacturer'
        })
        .expect(404)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 422 if no name is in the request body', async function () {
      await request(server)
        .put(`/items/${item._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description: 'new item description',
          manufacturer: 'new manufacturer'
        })
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 422 if no description is in the request body', async function () {
      await request(server)
        .put(`/items/${item._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'new item name',
          manufacturer: 'new manufacturer'
        })
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
    it('should throw 422 if no manufacturer is in the request body', async function () {
      await request(server)
        .put(`/items/${item._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'new item name',
          description: 'new item description'
        })
        .expect(422)
        .expect('Content-Type', new RegExp('application/json;'))
        .then((res) => {
          expect(res.body).to.exist.and.to.have.property('message');
        });
    });
  });
  describe('DELETE /items/:id', function () {});
});
