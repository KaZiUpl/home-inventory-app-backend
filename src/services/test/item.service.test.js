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
  describe('Get item', function () {
    let item;
    beforeEach(async function () {
      item = await Item.create({
        name: 'item',
        description: 'item description',
        manufacturer: 'manufacturer'
      });
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it('should return item', async function () {
      const requestedItem = await ItemsService.getItem(item._id);

      expect(requestedItem).to.exist.an.be.a('object');
      expect(requestedItem).to.have.property('name', 'item');
      expect(requestedItem).to.have.property('description', 'item description');
      expect(requestedItem).to.have.property('manufacturer', 'manufacturer');
    });
    it('should throw if item id is invalid', async function () {
      await expect(ItemsService.getItem('asd')).to.be.rejected;
    });
    it('should throw if item id is null', async function () {
      await expect(ItemsService.getItem(null)).to.be.rejected;
    });
    it('should throw if item is not found', async function () {
      const id = mongoose.Types.ObjectId();

      await expect(ItemsService.getItem(id)).to.be.rejected;
    });
  });
  describe('Get items list', function () {});
  describe('Update item info', function () {});
  describe('Delete an item', function () {});
  describe('Check item access', function () {
    let userItem, otherUserItem, globalItem;
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

    it('should be fulfilled if user has access to an item', async function () {
      await expect(ItemsService.checkItemAccess(user._id, userItem._id)).to.be
        .fulfilled;
    });
    it('should be fulfilled if user is trying to access global item', async function () {
      await expect(ItemsService.checkItemAccess(user._id, globalItem._id)).to.be
        .fulfilled;
    });
    it('should throw if item does not exist', async function () {
      await expect(
        ItemsService.checkItemAccess(user._id, mongoose.Types.ObjectId())
      ).to.be.rejected;
    });
    it('should throw if user does not have access to an item', async function () {
      await expect(ItemsService.checkItemAccess(user._id, otherUserItem._id)).to
        .be.rejected;
    });
    it('should throw if user id is null', async function () {
      await expect(ItemsService.checkItemAccess(null, userItem._id)).to.be
        .rejected;
    });
    it('should throw if item id is null', async function () {
      await expect(ItemsService.checkItemAccess(user._id, null)).to.be.rejected;
    });
  });
});
