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
      expect(response).to.have.deep.property('house', house._id);
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

      let output = storageItem.toJSON();
      output.item = item.toJSON();

      let output2 = storageItem2.toJSON();
      output2.item = item.toJSON();

      expect(storageItemArray[0].toJSON()).to.deep.equal(output);
      expect(storageItemArray[1].toJSON()).to.deep.equal(output2);
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
        quantity: 1
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

      let _tmp = storageItem.toJSON();
      _tmp.item = item.toJSON();

      expect(response).to.be.deep.equal(_tmp);
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
  });
  describe('Delete storage item', function () {
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
});
