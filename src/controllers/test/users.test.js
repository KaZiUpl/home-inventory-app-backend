const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

chai.use(chaiAsPromised);

// Then either:
const expect = chai.expect;

const {
  BadRequestError,
  UnprocessableEntityError,
  ForbiddenError
} = require('../../error/errors');

const UsersController = require('../users');
const User = require('../../models/user.model');

describe('Users Controller', function () {
  before(async function () {
    // connect to test db
    await mongoose.connect(process.env.MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  });
  after(async function () {
    await mongoose.connection.close();
  });

  describe('Create new user', function () {
    beforeEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });
    afterEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });

    it('should throw BadRequestError if user with login already exist', async function () {
      //create test user
      await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'admin'
      });

      const req = {
        body: {
          login: 'kacperkaz',
          email: 'kacper@example.com',
          password: 'asd'
        }
      };

      await expect(UsersController.createNewUser(req)).to.be.rejectedWith(
        BadRequestError
      );
    });

    it('should throw BadRequestError if user with email already exist', async function () {
      //create test user
      await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'admin'
      });

      const req = {
        body: {
          login: 'kacperaz',
          email: 'kacperkaz@example.com',
          password: 'asd'
        }
      };
      await expect(UsersController.createNewUser(req)).to.be.rejectedWith(
        BadRequestError
      );
    });

    it('should create a new user', async function () {
      //create test user
      const req = {
        body: {
          login: 'kacperkaz',
          email: 'kacperkaz@example.com',
          password: 'asd'
        }
      };
      let response = await UsersController.createNewUser(req);
      let users = await User.find({});

      expect(response).to.have.property('message');
      expect(users.length).to.equal(1);
    });

    it('should throw UnprocessableEntityError if login is not present in body', async function () {
      const req = {
        body: {
          email: 'kacperkaz@example.com',
          password: 'asd'
        }
      };

      await expect(UsersController.createNewUser(req)).to.be.rejectedWith(
        UnprocessableEntityError
      );
    });

    it('should throw UnprocessableEntityError if email is not present in body', async function () {
      const req = {
        body: {
          login: 'kacperkaz',
          password: 'asd'
        }
      };

      await expect(UsersController.createNewUser(req)).to.be.rejectedWith(
        UnprocessableEntityError
      );
    });

    it('should throw UnprocessableEntityError if password is not present in body', async function () {
      const req = {
        body: {
          login: 'kacperkaz',
          email: 'kacperkaz@example.com'
        }
      };

      await expect(UsersController.createNewUser(req)).to.be.rejectedWith(
        UnprocessableEntityError
      );
    });
  });
  describe('Change login', function () {
    beforeEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });
    afterEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });

    it('should modify user data', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'user'
      });

      const req = {
        body: {
          login: 'kacperaz'
        },
        userData: {
          id: user.id,
          email: 'kacperkaz@example.com'
        },
        params: {
          id: user.id
        }
      };

      //get user after modifying login
      let response = await UsersController.changeLogin(req);
      let newUser = await User.findById(user._id);

      expect(response).to.have.property('message');
      expect(newUser).to.have.property('login', 'kacperaz');
    });

    it('should throw BadRequestError if provided login is taken', async function () {
      //create first user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'user'
      });
      //create second user
      let user2 = await User.create({
        login: 'asd',
        email: 'asd@example.com',
        password: 'asd',
        role: 'user'
      });

      const req = {
        body: {
          login: 'kacperkaz'
        },
        userData: {
          id: user2.id,
          email: 'asd@example.com'
        },
        params: {
          id: user2.id
        }
      };

      await expect(UsersController.changeLogin(req)).to.be.rejectedWith(
        BadRequestError
      );
    });

    it('should throw ForbiddenError when trying to modify someone else login', async function () {
      //create first user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'user'
      });
      //create second user
      let user2 = await User.create({
        login: 'asd',
        email: 'asd@example.com',
        password: 'asd',
        role: 'user'
      });

      const req = {
        body: {
          login: 'sdf'
        },
        userData: {
          id: user.id,
          email: 'kacperkaz@example.com'
        },
        params: {
          id: user2.id
        }
      };

      await expect(UsersController.changeLogin(req)).to.be.rejectedWith(
        ForbiddenError
      );
    });
  });
  describe('Get user', function () {
    beforeEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });
    afterEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });

    it('should return a user', async function () {
      //create user
      let user = await User.create({
        login: 'asd',
        email: 'asd@example.com',
        password: 'asd',
        role: 'user'
      });

      const req = {
        params: {
          id: user._id
        },
        userData: {
          id: user._id
        }
      };
      let response = await (await UsersController.getUser(req)).toJSON();

      expect(response).to.be.a('object');
      expect(response).to.not.have.property('_id');
      expect(response).to.have.property('login');
      expect(response).to.have.property('email');
    });

    it('should throw ForbiddenError when trying to access other user data', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'user'
      });
      //create user 2
      let user2 = await User.create({
        login: 'asd',
        email: 'asd@example.com',
        password: 'asd',
        role: 'user'
      });
    });

    it('should throw BadRequestError when trying to access non-existent user data', async function () {
      //create id
      let id = mongoose.Types.ObjectId();

      const req = {
        params: {
          id: id
        },
        userData: {
          id: id
        }
      };

      await expect(UsersController.getUser(req)).to.be.rejectedWith(
        BadRequestError
      );
    });
  });
  describe('Put user', function () {
    beforeEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });
    afterEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });

    it('should update user data', async function () {
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'user'
      });

      const req = {
        body: {
          login: 'asd'
        },
        params: {
          id: user._id
        },
        userData: {
          id: user._id
        }
      };

      let response = await UsersController.modifyUser(req);
      let updatedUser = await User.findById(user._id);

      expect(updatedUser).to.have.property('login', 'asd');
    });

    it("should throw ForbiddenError when trying to change other user's data", async function () {
      let user1 = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'user'
      });
      let user2 = await User.create({
        login: 'asd',
        email: 'asd@example.com',
        password: 'asd',
        role: 'user'
      });

      const req = {
        body: {
          login: 'asd'
        },
        params: {
          id: user2._id
        },
        userData: {
          id: user1._id
        }
      };

      await expect(UsersController.modifyUser(req)).to.be.rejectedWith(
        ForbiddenError
      );
    });

    it("should not update user's role, email or password", async function () {
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'user'
      });

      const req = {
        body: {
          email: 'asd@example.com',
          password: 'sdf',
          role: 'admin'
        },
        params: {
          id: user._id
        },
        userData: {
          id: user._id
        }
      };

      let response = await UsersController.modifyUser(req);
      let updatedUser = await User.findById(user._id);

      expect(updatedUser).to.have.property('email', 'kacperkaz@example.com');
      expect(updatedUser).to.have.property('password', 'asd');
      expect(updatedUser).to.have.property('role', 'user');
    });
  });
  describe('Login', function () {
    beforeEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });
    afterEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });

    it('should return access and refresh tokens', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });

      const req = {
        body: {
          login: 'kacperkaz',
          password: 'asd'
        }
      };

      let response = await UsersController.login(req);

      expect(response).to.be.a('object');
      expect(response).to.have.property('access_token');
      expect(response).to.have.property('refresh_token');
    });

    it('should add refresh token to the user in a database', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });

      const req = {
        body: {
          login: 'kacperkaz',
          password: 'asd'
        }
      };

      await UsersController.login(req);

      let dbUser = await User.findById(user._id);

      expect(dbUser).to.have.property('refresh_token');
      expect(dbUser.refresh_token).to.be.a('string');
    });

    it('should throw BadRequestError when trying to log in with invalid credentials', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });

      const req = {
        body: {
          login: 'kacperkaz',
          password: 'dfg'
        }
      };

      await expect(UsersController.login(req)).to.be.rejectedWith(
        BadRequestError
      );
    });

    it('should throw UnprocessableEntityError when credentials are not present', async function () {
      const req = {
        body: {}
      };

      await expect(UsersController.login(req)).to.be.rejectedWith(
        UnprocessableEntityError
      );
    });
  });
  describe('Refresh access token', function () {
    beforeEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });
    afterEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });

    it('should return new access token', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh token
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      let refreshToken = jwt.sign(
        {
          login: user.login,
          email: user.email,
          id: user._id,
          role: user.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );

      //add refresh token do db
      user.refresh_token = refreshToken;
      await user.save();

      const req = {
        body: {
          token: refreshToken
        }
      };

      let response = await UsersController.refreshToken(req);

      expect(response).to.have.property('access_token');
      expect(response).to.have.property('refresh_token');
    });

    it('should throw UnprocessableEntityError when refresh token is malformed', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh token
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      let refreshToken = jwt.sign(
        {
          login: user.login,
          email: user.email,
          id: user._id,
          role: user.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );

      //add refresh token do db
      user.refresh_token = refreshToken;
      await user.save();

      const req = {
        body: {
          token: 'asd'
        }
      };

      await expect(UsersController.refreshToken(req)).to.be.rejectedWith(
        UnprocessableEntityError
      );
    });

    it('should throw BadRequestError if user is not logged in', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh token
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      let refreshToken = jwt.sign(
        {
          login: user.login,
          email: user.email,
          id: user._id,
          role: user.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );

      const req = {
        body: {
          token: refreshToken
        }
      };

      await expect(UsersController.refreshToken(req)).to.be.rejectedWith(
        BadRequestError
      );
    });
  });
  describe('Logout', function () {
    beforeEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });
    afterEach(async function () {
      //clear Users collection
      await User.deleteMany({});
    });

    it('should logout user', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh token
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      let refreshToken = jwt.sign(
        {
          login: user.login,
          email: user.email,
          id: user._id,
          role: user.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );

      //add refresh token do db
      user.refresh_token = refreshToken;
      await user.save();

      const req = {
        body: {
          token: refreshToken
        }
      };

      let response = await UsersController.logout(req);
      let dbUser = await (await User.findById(user._id)).toJSON();

      expect(dbUser).to.not.have.property('refresh_token');
    });

    it('should throw BadRequestError if token not present in body', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh token
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      let refreshToken = jwt.sign(
        {
          login: user.login,
          email: user.email,
          id: user._id,
          role: user.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );

      //add refresh token do db
      user.refresh_token = refreshToken;
      await user.save();

      const req = {
        body: {}
      };

      await expect(UsersController.logout(req)).to.be.rejectedWith(
        BadRequestError
      );
    });
  });
});
