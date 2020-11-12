const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');

chai.use(chaiAsPromised);

const expect = chai.expect;

const HousesService = require('../houses.service');

const User = require('../../models/user.model');
const House = require('../../models/house.model');
const Room = require('../../models/room.model');

describe('Houses Service', function () {
  var user1, user2;
  before(async function () {
    // connect to test db
    await mongoose.connect(process.env.MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    // create test users
    user1 = await User.create({
      login: 'user1',
      email: 'user1@example.com',
      password: 'user1',
      role: 'user'
    });
    user2 = await User.create({
      login: 'user2',
      email: 'user2@example.com',
      password: 'user2',
      role: 'user'
    });
  });
  after(async function () {
    //clear House and User collection
    await House.deleteMany({});
    await User.deleteMany({});
    //close the connection
    await mongoose.connection.close();
  });

  describe('Create a house', function () {
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });

    it('should create a house', async function () {
      const body = {
        name: 'house',
        description: 'description'
      };

      await expect(
        HousesService.createHouse(user1._id, body.name, body.description)
      ).to.be.fulfilled;

      let house = await House.findOne({});

      expect(house).to.exist;
      expect(house).to.have.property('name', 'house');
      expect(house).to.have.property('description', 'description');
      expect(house).to.have.deep.property('owner', user1._id);
    });
  });
  describe('Create a room', function () {
    let house;
    beforeEach(async function () {
      await House.deleteMany({});
      house = await House.create({
        name: 'house',
        description: 'description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });
    it('should create a room', async function () {
      const body = { name: 'room', description: 'description' };

      await expect(
        HousesService.createRoom(house._id, body.name, body.description)
      ).to.be.fulfilled;

      let updatedHouse = await House.findById(house._id);
      let room = await Room.findOne({ house: house._id });

      expect(updatedHouse.rooms).to.exist.and.to.have.lengthOf(1);
      expect(updatedHouse.rooms).to.have.deep.members([room._id]);

      expect(room).to.exist;
      expect(room).to.have.property('name', 'room');
      expect(room).to.have.property('description', 'description');
      expect(room).to.have.deep.property('house', house._id);
    });
    it('should throw if houseId is invalid', async function () {
      const body = { name: 'room', description: 'description' };

      await expect(HousesService.createRoom('asd', body.name, body.description))
        .to.be.rejected;
    });
    it('should throw if houseId is null', async function () {
      const body = { name: 'room', description: 'description' };

      await expect(HousesService.createRoom(null, body.name, body.description))
        .to.be.rejected;
    });
  });
  describe('Get house list', function () {
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });

    it('should return array of houses', async function () {
      //create houses
      await House.create({ name: 'asd', description: 'asd', owner: user1._id });
      await House.create({ name: 'sdf', owner: user1._id });

      let response = await HousesService.getHouseList(user1._id);

      expect(response).to.be.a('array');
      expect(response.length).to.be.equal(2);
      expect(response[0]).to.have.property('name');
      expect(response[0]).to.have.property('description');
      expect(response[0]).to.have.property('owner');
    });
  });
  describe('Get house info', function () {
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });
    it('should return house info', async function () {
      let house = await House.create({
        owner: user1._id,
        name: 'asd',
        description: 'asd'
      });

      let response = await HousesService.getHouse(house._id);

      expect(response).to.be.a('object');
      expect(response).to.have.property('name', 'asd');
      expect(response).to.have.property('description', 'asd');
      expect(response).to.have.property('owner');
    });
    it('should throw when trying to access non-existent house', async function () {
      let id = mongoose.Types.ObjectId();

      await expect(HousesService.getHouse(id)).to.be.rejected;
    });
    it('should throw when provided house id is invalid', async function () {
      const id = 'asd';

      await expect(HousesService.getHouse(id)).to.be.rejected;
    });
  });
  describe('Get rooms list', function () {
    let house;
    beforeEach(async function () {
      await House.deleteMany({});
      house = await House.create({
        name: 'house',
        description: 'description',
        owner: user1._id
      });
      let room = await Room.create({
        name: 'room',
        description: 'room description',
        house: house._id
      });

      house.rooms = [room._id];
      house = await house.save();
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should return rooms list', async function () {
      let rooms = await HousesService.getRooms(house._id);

      expect(rooms).to.exist.and.be.a('array').of.length(1);
      expect(rooms[0]).to.have.property('name', 'room');
      expect(rooms[0]).to.have.property('description', 'room description');
      expect(rooms[0]).to.have.deep.property('house', house._id);
    });
    it('should throw if houseId is invalid', async function () {
      await expect(HousesService.getRooms('asd')).to.be.rejected;
    });
    it('should throw if houseId is null', async function () {
      await expect(HousesService.getRooms(null)).to.be.rejected;
    });
  });
  describe('Modify house info', function () {
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });

    it('should modify house info', async function () {
      let house = await House.create({
        name: 'asd',
        description: 'asd',
        owner: user1._id
      });

      const body = { name: 'sdf', description: 'sdf' };

      await expect(
        HousesService.editHouse(house._id, body.name, body.description)
      ).to.be.fulfilled;

      let updatedHouse = await (await House.findById(house._id)).toJSON();

      expect(updatedHouse).to.exist;
      expect(updatedHouse).to.have.property('name', 'sdf');
      expect(updatedHouse).to.have.property('description', 'sdf');
    });
    it('should throw if provided house id is invalid', async function () {
      let house = await House.create({
        name: 'asd',
        description: 'asd',
        owner: user1._id
      });

      const body = { name: 'sdf', description: 'sdf' };

      await expect(HousesService.editHouse('asd', body.name, body.description))
        .to.be.rejected;
    });
    it('should throw if provided house id does not exist', async function () {
      let house = await House.create({
        name: 'asd',
        description: 'asd',
        owner: user1._id
      });

      const body = {
        id: mongoose.Types.ObjectId(),
        name: 'sdf',
        description: 'sdf'
      };

      await expect(
        HousesService.editHouse(body.id, body.name, body.description)
      ).to.be.rejected;
    });
  });
  describe('Delete house', function () {
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });

    it('should delete house', async function () {
      let house = await House.create({
        name: 'asd',
        description: 'asd',
        owner: user1._id
      });

      await expect(HousesService.deleteHouse(house._id)).to.be.fulfilled;

      let dbHouse = await House.findById(house._id);

      expect(dbHouse).to.not.exist;
    });
    it('should throw if house does not exist', async function () {
      let house = await House.create({
        name: 'asd',
        description: 'asd',
        owner: user1._id
      });

      const id = mongoose.Types.ObjectId();

      await expect(HousesService.deleteHouse(id)).to.be.rejected;
    });
    it('should throw if provided house id is invalid', async function () {
      let house = await House.create({
        name: 'asd',
        description: 'asd',
        owner: user1._id
      });

      await expect(HousesService.deleteHouse('asd')).to.be.rejected;
    });
  });
  describe('Add a collaborator', function () {
    let house;
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
      house = await House.create({
        name: 'house',
        description: 'description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });

    it('should add a collaborator', async function () {
      await expect(HousesService.addCollaborator(house._id, user2.login)).to.be
        .fulfilled;

      let modifiedHouse = await (await House.findById(house._id)).toJSON();

      expect(modifiedHouse).to.have.property('collaborators');
      expect(modifiedHouse.collaborators).to.be.a('array');
      expect(modifiedHouse.collaborators).to.have.deep.members([user2._id]);
    });
    it('should throw if user is a collaborator', async function () {
      //add user as a collaborator
      house.collaborators = [user2._id];
      await house.save();

      await expect(HousesService.addCollaborator(house._id, user2.login)).to.be
        .rejected;
    });
    it('should throw if trying to add an owner as a collaborator', async function () {
      await expect(HousesService.addCollaborator(house._id, user1.login)).to.be
        .rejected;
    });
    it('should throw if house id is invalid', async function () {
      await expect(HousesService.addCollaborator('asd', user2._id)).to.be
        .rejected;
    });
    it('should throw if provided user with provided login or email does not exist', async function () {
      const login = 'nonexistentLogin';

      await expect(HousesService.addCollaborator(house._id, login)).to.be
        .rejected;
    });
    it('should throw if provided house id does not exist', async function () {
      const id = mongoose.Types.ObjectId();

      await expect(HousesService.addCollaborator(id, user2._id)).to.be.rejected;
    });
    it('should throw if house id is null', async function () {
      await expect(HousesService.addCollaborator(null, user2.login)).to.be
        .rejected;
    });
    it('should throw if collaborator login is null', async function () {
      await expect(HousesService.addCollaborator(house.id, null)).to.be
        .rejected;
    });
  });
  describe('Get collaborator list', function () {
    let house;
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
      house = await House.create({
        name: 'house',
        description: 'description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });

    it('should return an array of collaborators', async function () {
      //add collaborator
      house.collaborators = [user2._id];
      await house.save();

      let collaborators = await HousesService.getCollaborators(house._id);

      expect(collaborators).to.be.a('array');
      expect(collaborators.length).to.be.equal(1);
      expect(collaborators[0]).to.have.property('_id');
      expect(collaborators[0]).to.have.property('login');
    });
    it('should throw if provided house id is invalid', async function () {
      await expect(HousesService.getCollaborators('asd')).to.be.rejected;
    });
    it('should throw provided house id does not exist', async function () {
      const id = mongoose.Types.ObjectId();

      await expect(HousesService.getCollaborators(id)).to.be.rejected;
    });
    it('should throw if house id is null', async function () {
      await expect(HousesService.getCollaborators(null)).to.be.rejected;
    });
  });
  describe('Delete a collaborator', function () {
    let house;
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
      house = await House.create({
        name: 'house',
        description: 'description',
        owner: user1._id,
        collaborator: [user2._id]
      });
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });

    it('should delete a collaborator', async function () {
      await expect(HousesService.deleteCollaborator(house._id, user2._id)).to.be
        .fulfilled;

      let updatedHouse = await House.findById(house._id);

      expect(updatedHouse.collaborators).to.be.empty;
    });
    it('should throw if house id is invalid', async function () {
      await expect(HousesService.deleteCollaborator('asd', user2._id)).to.be
        .rejected;
    });
    it('should throw if house id does not exist', async function () {
      const houseId = mongoose.Types.ObjectId();

      await expect(HousesService.deleteCollaborator(houseId, user2._id)).to.be
        .rejected;
    });
    it('should throw if house id is null', async function () {
      await expect(HousesService.deleteCollaborator(null, user2._id)).to.be
        .rejected;
    });
    it('should throw if collaborator id is null', async function () {
      await expect(HousesService.deleteCollaborator(house._id, null)).to.be
        .rejected;
    });
  });
  describe('Check house existence', function () {
    let house;
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
      house = await House.create({
        name: 'house',
        description: 'description',
        owner: user1._id,
        collaborator: [user2._id]
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should be fulfilled if house with provided id exist', async function () {
      await expect(HousesService.checkHouseExistence(house._id)).to.be
        .fulfilled;
    });
    it('should throw if house with provided id does not exist', async function () {
      await expect(HousesService.checkHouseExistence(mongoose.Types.ObjectId()))
        .to.be.rejected;
    });
  });
  describe('Check house ownership', function () {
    let house, house2;
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
      house = await House.create({
        name: 'house',
        description: 'description',
        owner: user1._id,
        collaborator: [user2._id]
      });
      house2 = await House.create({
        name: 'house',
        description: 'description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should be fulfilled if user is the house owner', async function () {
      await expect(HousesService.checkHouseOwnership(house._id, user1._id)).to
        .be.fulfilled;
    });
    it('should throw if user is a house collaborator', async function () {
      await expect(HousesService.checkHouseOwnership(house._id, user2._id)).to
        .be.rejected;
    });
    it('should throw if user is not a house owner nor a house collaborator', async function () {
      await expect(HousesService.checkHouseOwnership(house2._id, user2._id)).to
        .be.rejected;
    });
  });
  describe('Check house access', function () {
    let house, house2;
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
      house = await House.create({
        name: 'house',
        description: 'description',
        owner: user1._id,
        collaborator: [user2._id]
      });
      house2 = await House.create({
        name: 'house',
        description: 'description',
        owner: user1._id
      });
    });
    afterEach(async function () {
      await House.deleteMany({});
    });

    it('should be fulfilled if user is a house owner', async function () {
      await expect(HousesService.checkHouseAccess(house._id, user1._id)).to.be
        .fulfilled;
    });
    it('should be fulfilled if user is a house collaborator', async function () {
      await expect(HousesService.checkHouseAccess(house._id, user2._id)).to.be
        .rejected;
    });
    it('should throw if user is not a house owner nor a house collaborator', async function () {
      await expect(HousesService.checkHouseAccess(house2._id, user2._id)).to.be
        .rejected;
    });
  });
});
