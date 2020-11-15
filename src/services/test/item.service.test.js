const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');

chai.use(chaiAsPromised);

const expect = chai.expect;

const ItemsService = require('../items.service');
const User = require('../../models/user.model');
const Item = require('../../models/item.model');

describe('Items Service', function () {
  let user;
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

  describe('Create an item', function () {
    it("should create an item for a user and return it's id", async function () {
      const itemBody = {
        name: 'item'
      };
      let id = await ItemsService.createItem(user._id, itemBody);

      expect(id).to.be.a('object');

      let item = await Item.findById(id);

      expect(item).to.exist.and.be.a('object');
      expect(item).to.have.property('_id').deep.equal(id);
      expect(item).to.have.property('owner').deep.equal(user._id);
      expect(item).to.have.property('name', 'item');
    });
    it('should throw if user id is invalid', async function () {
      const itemBody = {
        name: 'item'
      };

      await expect(ItemsService.createItem('asd', itemBody)).to.be.rejected;
    });
    it('should throw if user id is null', async function () {
      const itemBody = {
        name: 'item'
      };

      await expect(ItemsService.createItem(null, itemBody)).to.be.rejected;
    });
    it('should throw if item data is empty', async function () {
      await expect(ItemsService.createItem(user._id, {})).to.be.rejected;
    });
    it('should throw if item data is null', async function () {
      await expect(ItemsService.createItem(user._id, null)).to.be.rejected;
    });
  });
  describe('Get item', function () {});
  describe('Get items list', function () {});
  describe('Update item info', function () {});
  describe('Delete an item', function () {});
});
