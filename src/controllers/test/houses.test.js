const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');

chai.use(chaiAsPromised);

const expect = chai.expect;

const {
  UnprocessableEntityError,
  ForbiddenError,
  NotFoundError
} = require('../../error/errors');
const HousesController = require('../houses');

const User = require('../../models/user.model');
const House = require('../../models/house.model');

describe('Houses Controller', function () {
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
      const req = {
        body: {
          name: 'house',
          description: 'description'
        },
        userData: {
          id: user1._id
        }
      };
      let response = await HousesController.createHouse(req);
      let house = await House.findOne({});
      expect(house).to.exist;
      expect(house).to.have.property('name', 'house');
      expect(house).to.have.property('description', 'description');
      expect(house).to.have.property('owner');
    });
    it('should throw UnprocessableEntityError if house name is not present', async function () {
      const req = {
        body: {
          description: 'description'
        },
        userData: {
          id: user1._id
        }
      };
      await expect(HousesController.createHouse(req)).to.be.rejectedWith(
        UnprocessableEntityError
      );
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
      const req = {
        userData: {
          id: user1._id
        }
      };

      let response = await HousesController.getHouseList(req);

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
    it('should return house info to owner', async function () {
      let house = await House.create({
        owner: user1.id,
        name: 'asd',
        description: 'asd'
      });

      const req = {
        params: { id: house._id },
        userData: { id: user1._id }
      };

      let response = await HousesController.getHouse(req);

      expect(response).to.be.a('object');
      expect(response).to.have.property('name', 'asd');
      expect(response).to.have.property('description', 'asd');
      expect(response).to.have.property('owner');
    });
    it('should return house info to collaborator', async function () {
      let house = await House.create({
        owner: user1.id,
        name: 'asd',
        description: 'asd',
        collaborators: [user2._id]
      });

      const req = {
        params: { id: house._id },
        userData: { id: user2._id }
      };

      let response = await HousesController.getHouse(req);

      expect(response).to.be.a('object');
      expect(response).to.have.property('name', 'asd');
      expect(response).to.have.property('description', 'asd');
      expect(response).to.have.property('owner');
      expect(response).to.have.property('collaborators');
    });
    it("should throw ForbiddenError when trying to access other user's house", async function () {
      let house = await House.create({
        owner: user1.id,
        name: 'asd',
        description: 'asd'
      });
      const req = {
        params: { id: house._id },
        userData: { id: user2._id }
      };

      await expect(HousesController.getHouse(req)).to.be.rejectedWith(
        ForbiddenError
      );
    });
    it('should throw NotFoundError when trying to access non-existent house', async function () {
      const req = {
        params: { id: mongoose.Types.ObjectId() },
        userData: { id: user1._id }
      };

      await expect(HousesController.getHouse(id)).to.be.rejectedWith(
        NotFoundError
      );
    });
    it('should throw UnprocessableEntityError when provided house id is invalid', async function () {
      const req = {
        params: { id: 'asd' },
        userData: { id: user1._id }
      };

      await expect(HousesController.getHouse(id)).to.be.rejectedWith(
        UnprocessableEntityError
      );
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

    context('when an owner', function () {
      it('should modify house info', async function () {
        let house = await House.create({
          name: 'asd',
          description: 'asd',
          owner: user1._id
        });

        const req = {
          body: { name: 'sdf', description: 'sdf' },
          params: { id: house._id },
          userData: { id: user1._id }
        };

        let response = await HousesController.editHouse(req);

        let updatedHouse = await (await House.findById(house._id)).toJSON();

        expect(updatedHouse).to.exist;
        expect(updatedHouse).to.have.property('name', 'sdf');
        expect(updatedHouse).to.have.property('description', 'sdf');
      });
      it('should not modify house owner', async function () {
        let house = await House.create({
          name: 'asd',
          description: 'asd',
          owner: user1._id
        });

        const req = {
          body: { name: 'sdf', description: 'sdf', owner: user2._id },
          params: { id: house._id },
          userData: { id: user1._id }
        };

        let response = await HousesController.editHouse(req);

        let updatedHouse = await await House.findById(house._id);

        expect(updatedHouse).to.exist;
        expect(updatedHouse).to.have.property('name', 'sdf');
        expect(updatedHouse).to.have.property('description', 'sdf');
        expect(updatedHouse).to.have.property('owner');
        expect(updatedHouse.owner).to.deep.equal(user1._id);
      });
      it('should not modify house collaborators', async function () {
        let house = await House.create({
          name: 'asd',
          description: 'asd',
          owner: user1._id,
          collaborators: [user2._id]
        });

        const req = {
          body: { name: 'sdf', description: 'sdf', collaborators: [] },
          params: { id: house._id },
          userData: { id: user1._id }
        };

        let response = await HousesController.editHouse(req);

        let updatedHouse = await await House.findById(house._id);

        expect(updatedHouse).to.exist;
        expect(updatedHouse).to.have.property('name', 'sdf');
        expect(updatedHouse).to.have.property('description', 'sdf');
        expect(updatedHouse.collaborators).to.deep.equal(house.collaborators);
      });
    });
    context('when not an owner', function () {
      it('should throw ForbiddenError', async function () {
        let house = await House.create({
          name: 'asd',
          description: 'asd',
          owner: user1._id
        });

        const req = {
          params: { id: house._id },
          body: { name: 'sdf', description: 'sdf' },
          userData: { id: user2._id }
        };

        await expect(HousesController.editHouse(req)).to.be.rejectedWith(
          ForbiddenError
        );
      });
    });
    it('should throw UnprocessableEntityError when provided house id is invalid', async function () {
      let house = await House.create({
        name: 'asd',
        description: 'asd',
        owner: user1._id
      });

      const req = {
        params: { id: 'asdfghjkl' },
        body: { name: 'sdf', description: 'sdf' },
        userData: { id: user2._id }
      };

      await expect(HousesController.editHouse(req)).to.be.rejectedWith(
        UnprocessableEntityError
      );
    });
    it('should throw NotFoundError when provided house id does not exist', async function () {
      let house = await House.create({
        name: 'asd',
        description: 'asd',
        owner: user1._id
      });

      const req = {
        params: { id: mongoose.Types.ObjectId() },
        body: { name: 'sdf', description: 'sdf' },
        userData: { id: user2._id }
      };

      await expect(HousesController.editHouse(req)).to.be.rejectedWith(
        NotFoundError
      );
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

    context('when an owner', async function () {
      it('should delete house', async function () {
        let house = await House.create({
          name: 'asd',
          description: 'asd',
          owner: user1._id
        });

        const req = {
          params: { id: house._id },
          userData: { id: user1._id }
        };

        let response = await HousesController.deleteHouse(req);
        let dbHouse = await House.findById(house._id);

        expect(dbHouse).to.not.exist;
      });
    });

    context('when not an owner', function () {
      it('should throw ForbiddenError', async function () {
        let house = await House.create({
          name: 'asd',
          description: 'asd',
          owner: user1._id
        });

        const req = {
          params: { id: house._id },
          userData: { id: user2._id }
        };

        await expect(HousesController.deleteHouse(req)).to.be.rejectedWith(
          ForbiddenError
        );
      });
    });
    it('should throw NotFoundError if house does not exist', async function () {
      let house = await House.create({
        name: 'asd',
        description: 'asd',
        owner: user1._id
      });

      const req = {
        params: { id: mongoose.Types.ObjectId() },
        userData: { id: user1._id }
      };

      await expect(HousesController.deleteHouse(req)).to.be.rejectedWith(
        NotFoundError
      );
    });
    it('should throw UnprocessableEntityError when provided house id is invalid', async function () {
      let house = await House.create({
        name: 'asd',
        description: 'asd',
        owner: user1._id
      });

      const req = {
        params: { id: 'asdas' },
        userData: { id: user1._id }
      };

      await expect(HousesController.deleteHouse(req)).to.be.rejectedWith(
        UnprocessableEntityError
      );
    });
  });
  describe('Add a collaborator', function () {
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });

    context('when an owner', function () {
      it('should add a collaborator', async function () {});
      it('should throw UnprocessableEntityError if provided house id is invalid', async function () {});
      it('should throw UnprocessableEntityError if provided collaborator id is invalid', async function () {});
    });
    context('when not an owner', function () {
      it('should throw BadRequestError', async function () {});
    });
    it('should throw UnprocessableEntityError when provided house id is invalid', async function () {});
    it('should throw NotFoundError when provided house id does not exist', async function () {});
  });
  describe('Get collaborator list', function () {
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });

    it('should return an array of collaborators', async function () {});
    it('should throw UnprocessableEntityError when provided house id is invalid', async function () {});
    it('should throw NotFoundError when provided house id does not exist', async function () {});
  });
  describe('Delete a collaborator', function () {
    beforeEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });
    afterEach(async function () {
      //clear House collection
      await House.deleteMany({});
    });

    context('when an owner', function () {
      it('should delete a collaborator', async function () {});
    });
    context('when not an owner', function () {
      it('should throw ForbiddenError', async function () {});
    });
    it('should throw UnprocessableEntityError when provided house id is invalid', async function () {});
    it('should throw NotFoundError when provided house id does not exist', async function () {});
  });
});
