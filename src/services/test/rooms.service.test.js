const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');

chai.use(chaiAsPromised);

const expect = chai.expect;

const RoomsService = require('../rooms.service');
const Room = require('../../models/room.model');
const House = require('../../models/house.model');
const User = require('../../models/user.model');

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
});