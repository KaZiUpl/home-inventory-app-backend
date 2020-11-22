const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

chai.use(chaiAsPromised);

const expect = chai.expect;

const ItemsService = require('../items.service');
const User = require('../../models/user.model');
const Item = require('../../models/item.model');
const { request } = require('express');

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
  describe('Get items list', function () {
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

    it('should return items array', async function () {
      let items = await ItemsService.getItems(user._id);

      expect(items).to.exist.and.be.a('array').of.length(2);
    });
    it('should throw if user id is invalid', async function () {
      await expect(ItemsService.getItems('asd')).to.be.rejected;
    });
    it('should throw if user id is null', async function () {
      await expect(ItemsService.getItems(null)).to.be.rejected;
    });
  });
  describe('Update item info', function () {
    let item;
    beforeEach(async function () {
      await Item.deleteMany({});
      item = await Item.create({
        name: 'item name',
        description: 'item description',
        manufacturer: 'manufacturer',
        owner: user._id,
        photo: 'asd'
      });
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it('should update item info', async function () {
      const itemBody = {
        name: 'new item name',
        description: 'new item description',
        manufacturer: 'new manufacturer'
      };

      await expect(ItemsService.putItem(item._id, itemBody)).to.be.fulfilled;

      let updatedItem = await Item.findById(item._id);

      expect(updatedItem).to.have.property('name', 'new item name');
      expect(updatedItem).to.have.property(
        'description',
        'new item description'
      );
      expect(updatedItem).to.have.property('manufacturer', 'new manufacturer');
    });
    it('should throw if item name is null', async function () {
      const itemBody = {
        description: 'new item description',
        manufacturer: 'new manufacturer'
      };

      await expect(ItemsService.putItem(item._id, itemBody)).to.be.rejected;
    });
    it('should not update owner id', async function () {
      const itemBody = {
        name: 'new item name',
        description: 'new item description',
        manufacturer: 'new manufacturer',
        owner: mongoose.Types.ObjectId()
      };

      await expect(ItemsService.putItem(item._id, itemBody)).to.be.fulfilled;

      let updatedItem = await Item.findById(item._id);

      expect(updatedItem).to.have.deep.property('owner', user._id);
    });
    it('should not update photo', async function () {
      const itemBody = {
        name: 'new item name',
        description: 'new item description',
        manufacturer: 'new manufacturer',
        owner: mongoose.Types.ObjectId(),
        photo: 'sdf'
      };

      await expect(ItemsService.putItem(item._id, itemBody)).to.be.fulfilled;

      let updatedItem = await Item.findById(item._id);

      expect(updatedItem).to.have.deep.property('photo', 'asd');
    });
  });
  describe('Update item image', function () {
    let item, imageFile, textFile;
    before(function () {
      //create user directory
      fs.mkdir(
        path.resolve(__dirname, `../../../public/img/${user._id}`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );
      //prepare files
      imageFile = {
        name: 'test_image.png',
        type: 'image/png',
        path: path.resolve(__dirname, '../../../public/img/test/test_image.png')
      };
      textFile = {
        name: 'test_file.txt',
        type: 'text/plain',
        path: path.resolve(__dirname, '../../../public/img/test/test_file.txt')
      };
    });
    after(function () {
      //delete user directory
      fs.rmdir(
        path.resolve(__dirname, `../../../public/img/${user._id}`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );
    });
    beforeEach(async function () {
      await Item.deleteMany({});
      item = await Item.create({
        name: 'item name',
        description: 'item description',
        owner: user._id
      });
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it('should create new image in /public/img/user_id', async function () {
      await expect(ItemsService.uploadItemImage(item._id, imageFile)).to.be
        .fulfilled;

      const imagePath = path.resolve(
        __dirname,
        `../../../public/img/${user._id}`
      );
      expect(fs.existsSync(imagePath + `/${item._id}.png`)).to.be.true;
    });
    it('should add image link to item', async function () {
      await expect(ItemsService.uploadItemImage(item._id, imageFile)).to.be
        .fulfilled;

      const imagePath = path.resolve(
        __dirname,
        `../../../public/img/${user._id}/${item._id}.png`
      );

      let updatedItem = await Item.findById(item._id);

      expect(updatedItem).to.have.property(
        'photo',
        `localhost:3000/img/${user._id}/${item._id}.png`
      );
    });
    it('should throw if file is not an image', async function () {
      await expect(ItemsService.uploadItemImage(item._id, textFile)).to.be
        .rejected;
    });
    it('should throw if file is null', async function () {
      await expect(ItemsService.uploadItemImage(item._id, null)).to.be.rejected;
    });
    it('should throw if itemId is invalid', async function () {
      await expect(ItemsService.uploadItemImage('asd', textFile)).to.be
        .rejected;
    });
    it('should throw if itemId is null', async function () {
      await expect(ItemsService.uploadItemImage(null, textFile)).to.be.rejected;
    });
  });
  describe('Delete an item', function () {
    let item;
    beforeEach(async function () {
      await Item.deleteMany({});
      item = await Item.create({
        name: 'item name',
        description: 'item description',
        manufacturer: 'item manufacturer',
        owner: user._id
      });
    });
    afterEach(async function () {
      await Item.deleteMany({});
    });

    it('should delete an item', async function () {
      await expect(ItemsService.deleteItem(item._id)).to.be.fulfilled;

      let deletedItem = await Item.findById(item._id);

      expect(deletedItem).to.not.exist;
    });
    it('should throw if item id is invalid', async function () {
      await expect(ItemsService.deleteItem('asd')).to.be.rejected;
    });
    it('should throw if no item with provided id is found', async function () {
      await expect(ItemsService.deleteItem(mongoose.Types.ObjectId())).to.be
        .rejected;
    });
    it('should throw if item id is null', async function () {
      await expect(ItemsService.deleteItem(null)).to.be.rejected;
    });
  });
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
