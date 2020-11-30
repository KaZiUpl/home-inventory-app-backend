const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

chai.use(chaiAsPromised);

const checkAuthMiddleware = require('../checkAuth');
const { UnauthorizedError } = require('../../error/errors');
const User = require('../../models/user.model');

describe('CheckAuthMiddleware', function () {
  let user;
  before(async function () {
    //create db connection
    await mongoose.connect(process.env.MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  });
  after(async function () {
    await mongoose.connection.close();
  });
  beforeEach(async function () {
    await User.deleteMany({});
    user = await User.create({
      login: 'kacperkaz',
      email: 'kacperkaz@example.com',
      password: 'asd',
      role: 'user'
    });
  });
  afterEach(async function () {
    await User.deleteMany({});
  });

  it('should throw UnauthorizedError if user is not logged in', async function () {
    // create access token
    const tokenTimestamp = Math.floor(Date.now() / 1000) + 15 * 60; // expires in 15 minutes
    const tokenExpDate = new Date(tokenTimestamp * 1000);

    const token = jwt.sign(
      {
        login: user.login,
        email: user.email,
        id: user._id,
        role: user.role,
        exp: tokenTimestamp
      },
      process.env.JWT_SECRET
    );
    const req = {
      get: function (headerName) {
        return `Bearer ${token}`;
      }
    };
    function next(error) {
      throw error;
    }

    await expect(checkAuthMiddleware(req, {}, next)).to.be.rejectedWith(
      UnauthorizedError
    );
  });
  it('should throw UnauthorizedError if no Authorization header is present', async function () {
    const req = {
      get: function (headerName) {
        return null;
      }
    };
    function next(error) {
      throw error;
    }

    await expect(checkAuthMiddleware(req, {}, next)).to.be.rejectedWith(
      UnauthorizedError
    );
  });
  it('should throw UnauthorizedError if Authorization header is malformed', async function () {
    const req = {
      get: function (headerName) {
        return 'xyz';
      }
    };
    function next(error) {
      throw error;
    }

    await expect(checkAuthMiddleware(req, {}, next)).to.be.rejectedWith(
      UnauthorizedError
    );
  });
  it('should throw UnauthorizedError if access token is invalid', async function () {
    const req = {
      get: function (headerName) {
        return 'Bearer xyz';
      }
    };
    function next(error) {
      throw error;
    }

    await expect(checkAuthMiddleware(req, {}, next)).to.be.rejectedWith(
      UnauthorizedError
    );
  });
  it('should add user data to userData property after decoding the token', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer xyz';
      }
    };

    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ id: 'abc' });
    checkAuthMiddleware(req, {}, () => {});

    expect(jwt.verify.called).to.be.true;
    expect(req).to.have.property('userData');
    expect(req.userData).to.have.property('id', 'abc');
    jwt.verify.restore();
  });
});
