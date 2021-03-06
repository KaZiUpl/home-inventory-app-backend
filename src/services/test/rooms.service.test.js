const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');

chai.use(chaiAsPromised);

const expect = chai.expect;

const RoomsService = require('../rooms.service');
const Room = require('../../models/room.model');
const House = require('../../models/house.model');
const User = require('../../models/user.model');
const Item = require('../../models/item.model');

describe('Rooms Service', function () {
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

  describe('Get room info', function () {
    let user, house, room;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      user = await User.create({
        login: 'user',
        email: 'user@example.com',
        password: 'asd',
        role: 'user'
      });
      house = await House.create({ name: 'house name', owner: user._id });
      room = await Room.create({ name: 'room name', house: house._id });
      house.rooms = [room._id];
      await house.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
    });

    it('should return room info on success', async function () {
      roomId = room._id;

      let response = await RoomsService.getRoom(roomId);

      expect(response).to.be.a('object');
      expect(response).to.have.property('name', 'room name');
      expect(response.house).to.exist.and.be.a('object');
      expect(response.house).to.have.deep.property('_id', house._id);
    });
    it('should throw if id is invalid', async function () {
      roomId = 'malformed';

      await expect(RoomsService.getRoom(roomId)).to.be.rejected;
    });
    it('should throw if no room with provided id was found', async function () {
      roomId = mongoose.Types.ObjectId();

      await expect(RoomsService.getRoom(roomId)).to.be.rejected;
    });
    it('should throw if id is null', async function () {
      await expect(RoomsService.getRoom(null)).to.be.rejected;
    });
  });
  describe('Delete a room', function () {
    let user, house, room;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      user = await User.create({
        login: 'user',
        email: 'user@example.com',
        password: 'asd',
        role: 'user'
      });
      house = await House.create({ name: 'house name', owner: user._id });
      room = await Room.create({ name: 'room name', house: house._id });
      house.rooms = [room._id];
      await house.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
    });

    it('should delete a room', async function () {
      await expect(RoomsService.deleteRoom(room._id)).to.be.fulfilled;

      let deletedRoom = await Room.findById(room._id);
      let deletedHouse = await House.findById(house._id);

      expect(deletedRoom).to.not.exist;
      expect(deletedHouse.rooms).to.be.a('array').of.length(0);
    });
    it('should throw if id is invalid', async function () {
      await expect(RoomsService.deleteRoom('asd')).to.be.rejected;
    });
    it('should throw if no room with provided id was found', async function () {
      await expect(RoomsService.deleteRoom(mongoose.Types.ObjectId())).to.be
        .rejected;
    });
    it('should throw if id is null', async function () {
      await expect(RoomsService.deleteRoom(null)).to.be.rejected;
    });
  });
  describe('Modify room info', function () {
    let user, house, room;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      user = await User.create({
        login: 'user',
        email: 'user@example.com',
        password: 'asd',
        role: 'user'
      });
      house = await House.create({ name: 'house name', owner: user._id });
      room = await Room.create({ name: 'room name', house: house._id });
      house.rooms = [room._id];
      await house.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
    });

    it('should modify room name and/or description', async function () {
      const body = {
        name: 'new room name',
        description: 'new room description'
      };

      await expect(
        RoomsService.modifyRoom(room._id, body.name, body.description)
      ).to.be.fulfilled;

      let modifiedRoom = await Room.findById(room._id);

      expect(modifiedRoom).to.have.property('name', body.name);
      expect(modifiedRoom).to.have.property('description', body.description);
    });
    it('should throw if room id is invalid', async function () {
      const body = {
        name: 'new room name',
        description: 'new room description'
      };

      await expect(RoomsService.modifyRoom('asd', body.name, body.description))
        .to.be.rejected;
    });
    it('should throw if no room with provided id was found', async function () {
      const body = {
        name: 'new room name',
        description: 'new room description'
      };

      await expect(
        RoomsService.modifyRoom(
          mongoose.Types.ObjectId(),
          body.name,
          body.description
        )
      ).to.be.rejected;
    });
    it('should throw if id is null', async function () {
      const body = {
        name: 'new room name',
        description: 'new room description'
      };

      await expect(RoomsService.modifyRoom(null, body.name, body.description))
        .to.be.rejected;
    });
  });
  describe('Create storage item', function () {
    let user, house, room, item;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
      user = await User.create({
        login: 'user',
        email: 'user@example.com',
        password: 'asd',
        role: 'user'
      });
      house = await House.create({ name: 'house name', owner: user._id });
      room = await Room.create({ name: 'room name', house: house._id });
      house.rooms = [room._id];
      await house.save();
      item = await Item.create({ name: 'item name', owner: user._id });
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
    });

    it('should create new storage item', async function () {
      let epoch = Date.now();
      let storageItemId = await RoomsService.addStorageItem(
        room._id,
        item._id,
        1,
        epoch,
        'desc'
      );
      expect(storageItemId).to.exist.and.be.a('object');

      let updatedRoom = await Room.findById(room._id);

      expect(updatedRoom.storage).to.exist.and.be.a('array').of.length(1);
      expect(updatedRoom.storage[0]).to.have.deep.property(
        '_id',
        storageItemId
      );
      expect(updatedRoom.storage[0]).to.have.deep.property('item', item._id);
      expect(updatedRoom.storage[0]).to.have.property('quantity', 1);
      expect(updatedRoom.storage[0]).to.have.deep.property(
        'expiration',
        new Date(epoch)
      );
      expect(updatedRoom.storage[0]).to.have.property('description', 'desc');
    });
    it('should throw if roomId is invalid', async function () {
      await expect(RoomsService.addStorageItem('asd', item._id, 1)).to.be
        .rejected;
    });
    it('should throw if roomId is null', async function () {
      await expect(RoomsService.addStorageItem(null, item._id, 1)).to.be
        .rejected;
    });
    it('should throw if room was not found', async function () {
      await expect(
        RoomsService.addStorageItem(mongoose.Types.ObjectId(), item._id, 1)
      ).to.be.rejected;
    });
    it('should throw if itemId is invalid', async function () {
      await expect(RoomsService.addStorageItem(room._id, 'asd', 1)).to.be
        .rejected;
    });
    it('should throw if itemId is null', async function () {
      await expect(RoomsService.addStorageItem(room._id, null, 1)).to.be
        .rejected;
    });
    it('should throw if item was not found', async function () {
      await expect(
        RoomsService.addStorageItem(room._id, mongoose.Types.ObjectId(), 1)
      ).to.be.rejected;
    });
    it('should throw if quantity is lower than 1', async function () {
      await expect(RoomsService.addStorageItem(room._id, item._id, -1)).to.be
        .rejected;
    });
  });
  describe('Get room storage', function () {
    let user, house, room, item;
    let epoch, storageItem, storageItem2;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
      user = await User.create({
        login: 'user',
        email: 'user@example.com',
        password: 'asd',
        role: 'user'
      });
      house = await House.create({ name: 'house name', owner: user._id });
      room = await Room.create({ name: 'room name', house: house._id });
      house.rooms = [room._id];
      await house.save();
      item = await Item.create({ name: 'item name', owner: user._id });

      epoch = Date.now();
      storageItem = await room.storage.create({
        item: item._id,
        quantity: 1
      });
      storageItem2 = await room.storage.create({
        item: item._id,
        quantity: 12,
        expiration: epoch,
        description: 'desc2'
      });
      room.storage.push(storageItem);
      room.storage.push(storageItem2);

      await room.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
    });

    it('should return array of storage items', async function () {
      let storageItemArray = await RoomsService.getRoomStorage(room._id);

      expect(storageItemArray).to.exist.and.be.a('array').of.length(2);

      expect(storageItemArray[0].toJSON()).to.include.all.keys(
        '_id',
        'item',
        'quantity'
      );
      expect(storageItemArray[0].item.toJSON()).to.include.all.keys(
        '_id',
        'name',
        'owner'
      );
      expect(storageItemArray[0].item.owner.toJSON()).to.include.all.keys(
        '_id',
        'login'
      );

      expect(storageItemArray[1].toJSON()).to.include.all.keys(
        '_id',
        'item',
        'quantity',
        'expiration'
      );
      expect(storageItemArray[1].item.toJSON()).to.include.all.keys(
        '_id',
        'name',
        'owner'
      );
      expect(storageItemArray[1].item.owner.toJSON()).to.include.all.keys(
        '_id',
        'login'
      );
    });
    it('should throw if room does not exist', async function () {
      await expect(RoomsService.getRoomStorage(mongoose.Types.ObjectId())).to.be
        .rejected;
    });
    it('should throw if room id is invalid', async function () {
      await expect(RoomsService.getRoomStorage('asd')).to.be.rejected;
    });
    it('should throw if room id is null', async function () {
      await expect(RoomsService.getRoomStorage(null)).to.be.rejected;
    });
  });
  describe('Get storage item', function () {
    let user, house, room, item;
    let epoch, storageItem;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
      user = await User.create({
        login: 'user',
        email: 'user@example.com',
        password: 'asd',
        role: 'user'
      });
      house = await House.create({ name: 'house name', owner: user._id });
      room = await Room.create({ name: 'room name', house: house._id });
      house.rooms = [room._id];
      await house.save();
      item = await Item.create({ name: 'item name', owner: user._id });

      epoch = Date.now();
      storageItem = await room.storage.create({
        item: item._id,
        quantity: 1,
        expiration: epoch
      });
      room.storage.push(storageItem);
      room.storage.push(
        await room.storage.create({
          item: item._id,
          quantity: 5
        })
      );

      await room.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
    });

    it('should return storage item', async function () {
      let response = await RoomsService.getStorageItem(
        room._id,
        storageItem._id
      );

      expect(response).to.exist.and.be.a('object');
      expect(response).to.include.all.keys('_id', 'item', 'quantity');
      expect(response.item).to.include.all.keys('_id', 'name', 'owner');
      expect(response.item.owner).to.include.all.keys('_id', 'login');
    });
    it('should throw if room is not found', async function () {
      await expect(
        RoomsService.getStorageItem(mongoose.Types.ObjectId(), storageItem._id)
      ).to.be.rejected;
    });
    it('should throw if storage item is not found', async function () {
      await expect(
        RoomsService.getStorageItem(room._id, mongoose.Types.ObjectId())
      ).to.be.rejected;
    });
    it('should throw if room id is invalid', async function () {
      await expect(RoomsService.getStorageItem('asd', storageItem._id)).to.be
        .rejected;
    });
    it('should throw if storage item id is invalid', async function () {
      await expect(RoomsService.getStorageItem(room._id, 'asd')).to.be.rejected;
    });
    it('should throw if room id is null', async function () {
      await expect(RoomsService.getStorageItem(null, storageItem._id)).to.be
        .rejected;
    });
    it('should throw if storage item id is null', async function () {
      await expect(RoomsService.getStorageItem(room._id, null)).to.be.rejected;
    });
  });
  describe('Update storage item', function () {
    let user, house, room, item;
    let epoch, storageItem, storageItem2;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
      user = await User.create({
        login: 'user',
        email: 'user@example.com',
        password: 'asd',
        role: 'user'
      });
      house = await House.create({ name: 'house name', owner: user._id });
      room = await Room.create({ name: 'room name', house: house._id });
      house.rooms = [room._id];
      await house.save();
      item = await Item.create({ name: 'item name', owner: user._id });

      epoch = Date.now();
      storageItem = await room.storage.create({
        item: item._id,
        quantity: 1,
        expiration: epoch,
        description: 'storage item'
      });
      room.storage.push(storageItem);

      storageItem2 = await room.storage.create({
        item: item._id,
        quantity: 5,
        expiration: epoch,
        description: 'storage item 2'
      });
      room.storage.push(storageItem2);

      await room.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
    });

    it('should update storage item', async function () {
      let newEpoch = Date.now();
      const newStorageItemData = {
        quantity: 2,
        expiration: newEpoch,
        description: 'new storage item description'
      };
      await expect(
        RoomsService.updateStorageItem(
          room._id,
          storageItem._id,
          newStorageItemData
        )
      ).to.be.fulfilled;

      let updatedRoom = await Room.findOne({ _id: room._id });
      let updatedStorageItem = updatedRoom.storage.filter((elem) =>
        elem._id.equals(storageItem._id)
      )[0];

      expect(updatedStorageItem).to.have.deep.property('_id', storageItem._id);
      expect(updatedStorageItem).to.have.deep.property(
        'item',
        storageItem.item
      );
      expect(updatedStorageItem).to.have.property(
        'quantity',
        newStorageItemData.quantity
      );
      expect(updatedStorageItem).to.have.property(
        'description',
        newStorageItemData.description
      );
      expect(updatedStorageItem).to.have.deep.property(
        'expiration',
        new Date(newStorageItemData.expiration)
      );
    });
    it('should throw if room id is invalid', async function () {
      let newEpoch = Date.now();
      const newStorageItemData = {
        quantity: 2,
        expiration: newEpoch,
        description: 'new storage item description'
      };
      await expect(
        RoomsService.updateStorageItem(
          'asd',
          storageItem._id,
          newStorageItemData
        )
      ).to.be.rejected;
    });
    it('should throw if storage item id is invalid', async function () {
      let newEpoch = Date.now();
      const newStorageItemData = {
        quantity: 2,
        expiration: newEpoch,
        description: 'new storage item description'
      };
      await expect(
        RoomsService.updateStorageItem(room._id, 'asd', newStorageItemData)
      ).to.be.rejected;
    });
    it('should throw if room is not found', async function () {
      let newEpoch = Date.now();
      const newStorageItemData = {
        quantity: 2,
        expiration: newEpoch,
        description: 'new storage item description'
      };
      await expect(
        RoomsService.updateStorageItem(
          mongoose.Types.ObjectId(),
          storageItem._id,
          newStorageItemData
        )
      ).to.be.rejected;
    });
    it('should throw if storage item is not found', async function () {
      let newEpoch = Date.now();
      const newStorageItemData = {
        quantity: 2,
        expiration: newEpoch,
        description: 'new storage item description'
      };
      await expect(
        RoomsService.updateStorageItem(
          room._id,
          mongoose.Types.ObjectId(),
          newStorageItemData
        )
      ).to.be.rejected;
    });
    it('should throw if room id is null', async function () {
      let newEpoch = Date.now();
      const newStorageItemData = {
        quantity: 2,
        expiration: newEpoch,
        description: 'new storage item description'
      };
      await expect(
        RoomsService.updateStorageItem(
          null,
          storageItem._id,
          newStorageItemData
        )
      ).to.be.rejected;
    });
    it('should throw if storage item id is null', async function () {
      let newEpoch = Date.now();
      const newStorageItemData = {
        quantity: 2,
        expiration: newEpoch,
        description: 'new storage item description'
      };
      await expect(
        RoomsService.updateStorageItem(room._id, null, newStorageItemData)
      ).to.be.rejected;
    });
    it('should throw if quantity is less than 1', async function () {
      let newEpoch = Date.now();
      const newStorageItemData = {
        quantity: 0,
        expiration: newEpoch,
        description: 'new storage item description'
      };
      await expect(
        RoomsService.updateStorageItem(
          room._id,
          storageItem._id,
          newStorageItemData
        )
      ).to.be.rejected;
    });
  });
  describe('Delete storage item', function () {
    let user, house, room, item;
    let epoch, storageItem, storageItem2;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
      user = await User.create({
        login: 'user',
        email: 'user@example.com',
        password: 'asd',
        role: 'user'
      });
      house = await House.create({ name: 'house name', owner: user._id });
      room = await Room.create({ name: 'room name', house: house._id });
      house.rooms = [room._id];
      await house.save();
      item = await Item.create({ name: 'item name', owner: user._id });

      epoch = Date.now();
      storageItem = await room.storage.create({
        item: item._id,
        quantity: 1,
        expiration: epoch,
        description: 'storage item'
      });
      room.storage.push(storageItem);

      storageItem2 = await room.storage.create({
        item: item._id,
        quantity: 5,
        expiration: epoch,
        description: 'storage item 2'
      });
      room.storage.push(storageItem2);

      await room.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
      await Item.deleteMany({});
    });

    it('should delete storage item', async function () {
      await expect(RoomsService.deleteStorageItem(room._id, storageItem._id)).to
        .be.fulfilled;

      let updatedRoom = await Room.findById(room._id);
      let deletedStorageItem = updatedRoom.storage.filter((elem) =>
        elem._id.equals(storageItem._id)
      );

      expect(deletedStorageItem).to.be.empty;
    });
    it('should throw if room id is invalid', async function () {
      await expect(RoomsService.deleteStorageItem('asd', storageItem._id)).to.be
        .rejected;
    });
    it('should throw if room id is null', async function () {
      await expect(RoomsService.deleteStorageItem(null, storageItem._id)).to.be
        .rejected;
    });
    it('should throw if room is not found', async function () {
      await expect(
        RoomsService.deleteStorageItem(
          mongoose.Types.ObjectId(),
          storageItem._id
        )
      ).to.be.rejected;
    });
    it('should throw if storage item id is invalid', async function () {
      await expect(RoomsService.deleteStorageItem(room._id, 'asd')).to.be
        .rejected;
    });
    it('should throw if storage item id is null', async function () {
      await expect(RoomsService.deleteStorageItem(room._id, null)).to.be
        .rejected;
    });
    it('should throw if storage item is not found', async function () {
      await expect(
        RoomsService.deleteStorageItem(room._id, mongoose.Types.ObjectId())
      ).to.be.rejected;
    });
  });
  describe('Check room existence', function () {
    let user, house, room;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});

      user = await User.create({
        login: 'user1',
        email: 'user1@example.com',
        password: 'asd',
        role: 'user'
      });

      house = await House.create({
        name: 'house1',
        owner: user._id
      });

      room = await Room.create({ name: 'room1', house: house._id });
      house.rooms = [room._id];
      await house.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
    });

    it('should be fulfilled if room exists', async function () {
      await expect(RoomsService.checkRoomExistence(room._id)).to.be.fulfilled;
    });
    it('should throw if room does not exist', async function () {
      await expect(RoomsService.checkRoomExistence(mongoose.Types.ObjectId()))
        .to.be.rejected;
    });
  });
  describe('Check room ownership', function () {
    let user1, user2, house1, house2, room1, room2;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});

      user1 = await User.create({
        login: 'user1',
        email: 'user1@example.com',
        password: 'asd',
        role: 'user'
      });
      user2 = await User.create({
        login: 'user2',
        email: 'user2@example.com',
        password: 'asd',
        role: 'user'
      });

      house1 = await House.create({
        name: 'house1',
        owner: user1._id,
        collaborators: [user2._id]
      });
      house2 = await House.create({ name: 'house2', owner: user1._id });

      room1 = await Room.create({ name: 'room1', house: house1._id });
      house1.rooms = [room1._id];
      await house1.save();

      room2 = await Room.create({ name: 'room2', house: house2._id });
      house2.rooms = [room2._id];
      await house2.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
    });

    it('should be fulfilled if user is a house owner', async function () {
      await expect(RoomsService.checkRoomOwnership(room1._id, user1._id)).to.be
        .fulfilled;
    });
    it('should throw if user if user is a house collaborator', async function () {
      await expect(RoomsService.checkRoomOwnership(room1._id, user2._id)).to.be
        .rejected;
    });
    it('should throw is user is not a house owner nor a house collaborator', async function () {
      await expect(RoomsService.checkRoomOwnership(room2._id, user2._id)).to.be
        .rejected;
    });
  });
  describe('Check room access', function () {
    let user1, user2, house1, house2, room1, room2;
    beforeEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});

      user1 = await User.create({
        login: 'user1',
        email: 'user1@example.com',
        password: 'asd',
        role: 'user'
      });
      user2 = await User.create({
        login: 'user2',
        email: 'user2@example.com',
        password: 'asd',
        role: 'user'
      });

      house1 = await House.create({
        name: 'house1',
        owner: user1._id,
        collaborators: [user2._id]
      });
      house2 = await House.create({ name: 'house2', owner: user1._id });

      room1 = await Room.create({ name: 'room1', house: house1._id });
      house1.rooms = [room1._id];
      await house1.save();

      room2 = await Room.create({ name: 'room2', house: house2._id });
      house2.rooms = [room2._id];
      await house2.save();
    });
    afterEach(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
    });

    it('should be fulfilled if user is a house owner', async function () {
      await expect(RoomsService.checkRoomAccess(room1._id, user1._id)).to.be
        .fulfilled;
    });
    it('should be fulfilled if user is a house collaborator', async function () {
      await expect(RoomsService.checkRoomAccess(room1._id, user2._id)).to.be
        .fulfilled;
    });
    it('should throw if user is not a house owner nor a house collaborator', async function () {
      await expect(RoomsService.checkRoomAccess(room2._id, user2._id)).to.be
        .rejected;
    });
  });
  describe('Check item access', function () {
    let user1, user2, room1, room2, room3, room4, room5, item, item2, item3;
    before(async function () {
      await Room.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});

      user1 = await User.create({
        login: 'user1',
        email: 'user1@example.com',
        password: 'asd',
        role: 'user'
      });
      user2 = await User.create({
        login: 'user2',
        email: 'user2@example.com',
        password: 'asd',
        role: 'user'
      });
      let user3 = await User.create({
        login: 'user3',
        email: 'user3@example.com',
        password: 'asd',
        role: 'user'
      });

      item = await Item.create({ name: 'item', owner: user1._id });
      item2 = await Item.create({ name: 'item2', owner: user2._id });
      item3 = await Item.create({ name: 'item3' });

      //item owner as an owner and requesting user as a collaborator
      let house1 = await House.create({
        name: 'house1',
        owner: user1._id,
        collaborators: [user2._id]
      });
      //requesting user as an owner and item owner as a as a collaborator
      let house2 = await House.create({
        name: 'house2',
        owner: user2._id,
        collaborators: [user1._id]
      });
      //both item owner and requesting user as a collaborators
      let house3 = await House.create({
        name: 'house3',
        owner: user3._id,
        collaborators: [user1._id, user2._id]
      });
      //item owner as an owner and no collaborators
      let house4 = await House.create({ name: 'house4', owner: user1._id });
      //item owner as a  collaborator
      let house5 = await House.create({
        name: 'house5',
        owner: user3._id,
        collaborators: [user1._id]
      });

      room1 = await Room.create({ name: 'room1', house: house1._id });
      house1.rooms = [room1._id];
      await house1.save();

      room2 = await Room.create({ name: 'room2', house: house2._id });
      house2.rooms = [room2._id];
      await house2.save();

      room3 = await Room.create({ name: 'room3', house: house3._id });
      house3.rooms = [room3._id];
      await house3.save();

      room4 = await Room.create({ name: 'room4', house: house4._id });
      house4.rooms = [room4._id];
      await house4.save();

      room5 = await Room.create({ name: 'room5', house: house5._id });
      house5.rooms = [room5._id];
      await house5.save();
    });
    after(async function () {
      await Room.deleteMany({});
      await Item.deleteMany({});
      await House.deleteMany({});
      await User.deleteMany({});
    });

    it('should be fulfilled if house owner adds his item', async function () {
      await expect(RoomsService.checkItemAccess(item._id, room1._id, user1._id))
        .to.be.fulfilled;
    });
    it('should be fulfilled if house collaborator adds his item', async function () {
      await expect(
        RoomsService.checkItemAccess(item2._id, room1._id, user2._id)
      ).to.be.fulfilled;
    });
    it('should be fulfilled if user adds global item', async function () {
      await expect(
        RoomsService.checkItemAccess(item3._id, room1._id, user1._id)
      ).to.be.fulfilled;
    });
    it('should be fulfilled if user is in the same house as the item owner', async function () {
      // item owner is a house owner and user is a house collaborator
      await expect(RoomsService.checkItemAccess(item._id, room1._id, user2._id))
        .to.be.fulfilled;

      // item owner is a collaborator and user is the house owner
      await expect(RoomsService.checkItemAccess(item._id, room2._id, user2._id))
        .to.be.fulfilled;

      // both item owner and house owner are collaborators
      await expect(RoomsService.checkItemAccess(item._id, room3._id, user2._id))
        .to.be.fulfilled;
    });
    it('should throw if user is not in the same house as the item owner', async function () {
      // item owner is the house owner and user is not a collaborator
      await expect(RoomsService.checkItemAccess(item._id, room4._id, user2._id))
        .to.be.rejected;

      // item owner is collaborator and user does not belong to a house
      await expect(RoomsService.checkItemAccess(item._id, room5._id, user2._id))
        .to.be.rejected;
    });
  });
});
