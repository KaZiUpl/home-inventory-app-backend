const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

chai.use(chaiAsPromised);

// Then either:
const expect = chai.expect;

const {
  BadRequestError,
  UnprocessableEntityError,
  ForbiddenError
} = require('../../error/errors');

const UsersService = require('../../services/users.service');
const User = require('../../models/user.model');

describe('Users Service', function () {
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
      //delete all users' image directories
      let users = await User.find({});
      users.forEach(async function (user) {
        await fs.promises.rmdir(
          path.join(process.env.CWD, `/public/img/${user._id}`),
          {
            recursive: true
          }
        );
      });
      //clear Users collection
      await User.deleteMany({});
    });

    it('should create a new user', async function () {
      const body = {
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd'
      };

      let response = await UsersService.createUser(
        body.login,
        body.email,
        body.password
      );
      let users = await User.find({});

      expect(response).to.be.instanceOf(mongoose.Types.ObjectId);
      expect(users.length).to.equal(1);
    });
    it('should create user image directory', async function () {
      const body = {
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd'
      };

      let response = await UsersService.createUser(
        body.login,
        body.email,
        body.password
      );

      const dirPath = path.join(process.env.CWD, `/public/img/${response}`);

      expect(fs.existsSync(dirPath)).to.be.true;
    });
    it('should throw if user with login already exist', async function () {
      //create test user
      await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'admin'
      });

      const body = {
        login: 'kacperkaz',
        email: 'kacper@example.com',
        password: 'asd'
      };

      await expect(
        UsersService.createUser(body.login, body.email, body.password)
      ).to.be.rejected;
    });
    it('should throw if user with email already exist', async function () {
      //create test user
      await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'admin'
      });

      const body = {
        login: 'kacperaz',
        email: 'kacperkaz@example.com',
        password: 'asd'
      };
      await expect(
        UsersService.createUser(body.login, body.email, body.password)
      ).to.be.rejected;
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

      let response = await (await UsersService.getUser(user._id)).toJSON();

      expect(response).to.be.a('object');
      expect(response).to.not.have.property('_id');
      expect(response).to.have.property('login');
      expect(response).to.have.property('email');
    });
    it('should throw when trying to access non-existent user data', async function () {
      //create id
      const id = mongoose.Types.ObjectId();

      await expect(UsersService.getUser(id)).to.be.rejected;
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

      const body = {
        login: 'asd'
      };

      await expect(UsersService.modifyUser(user._id, body)).to.be.fulfilled;

      let updatedUser = await User.findById(user._id);

      expect(updatedUser).to.have.property('login', body.login);
    });
    it("should not update user's role, email or password", async function () {
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password: 'asd',
        role: 'user'
      });

      const body = {
        login: 'newlogin',
        email: 'asd@example.com',
        password: 'sdf',
        role: 'admin'
      };

      await expect(UsersService.modifyUser(user._id, body)).to.be.fulfilled;

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

      const body = {
        login: 'kacperkaz',
        password: 'asd'
      };

      let response = await UsersService.login(body.login, body.password);

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

      const body = {
        login: 'kacperkaz',
        password: 'asd'
      };

      await expect(UsersService.login(body.login, body.password)).to.be
        .fulfilled;

      let dbUser = await User.findById(user._id);

      expect(dbUser).to.have.property('refresh_token');
      expect(dbUser.refresh_token).to.be.a('string');
    });
    it('should throw when trying to log in with invalid credentials', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });

      const body = {
        login: 'kacperkaz',
        password: 'dfg'
      };

      await expect(UsersService.login(body.login, body.password)).to.be
        .rejected;
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

      let response = await UsersService.refreshToken(refreshToken);

      expect(response).to.have.property('access_token');
      expect(response).to.have.property('refresh_token');
    });
    it('should throw if token is null', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });

      await expect(UsersService.refreshToken(null)).to.be.rejected;
    });
    it('should throw if refresh token is malformed', async function () {
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

      const token = 'asd';

      await expect(UsersService.refreshToken(token)).to.be.rejected;
    });
    it('should throw if refresh token is invalid', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh token
      let refreshTokenTimestamp =
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

      //generate wrong refresh token
      refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      let wrongToken = jwt.sign(
        {
          login: 'asd',
          email: 'asd@example.com',
          id: user._id,
          role: user.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );

      await expect(UsersService.refreshToken(wrongToken)).to.be.rejected;
    });
    it('should throw if user is not logged in', async function () {
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

      await expect(UsersService.refreshToken(refreshToken)).to.be.rejected;
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

      await expect(UsersService.logout(refreshToken)).to.be.fulfilled;

      let dbUser = await (await User.findById(user._id)).toJSON();

      expect(dbUser).to.not.have.property('refresh_token');
    });
    it('should throw if token is different from the one in a database', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh token
      let refreshTokenTimestamp =
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

      //generate wrong refresh token
      refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      let wrongToken = jwt.sign(
        {
          login: 'asd',
          email: 'asd@example.com',
          id: user._id,
          role: user.role,
          exp: refreshTokenTimestamp
        },
        process.env.JWT_SECRET
      );

      await expect(UsersService.logout(wrongToken)).to.be.rejected;
    });
    it('should throw if token is malformed', async function () {
      //create user
      let user = await User.create({
        login: 'kacperkaz',
        email: 'kacperkaz@example.com',
        password:
          '$2b$10$ecbupqJoYK4gFeZVcGQfpOYONp5GUUtqheW9AkA6/DHPgGtIGvc6K',
        role: 'user'
      });
      //create refresh token
      let refreshTokenTimestamp =
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

      let token = 'asd';

      await expect(UsersService.logout(token)).to.be.rejected;
    });
  });
});
