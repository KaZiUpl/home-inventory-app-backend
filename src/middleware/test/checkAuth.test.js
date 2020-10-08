const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const checkAuthMiddleware = require('../checkAuth');
const { UnauthorizedError } = require('../../error/errors');

describe('CheckAuthMiddleware', function () {
  it('should throw UnauthorizedError if no Authorization header is present', function () {
    const req = {
      get: function (headerName) {
        return null;
      }
    };

    expect(checkAuthMiddleware.bind(this, req, {}, () => {})).to.throw(
      UnauthorizedError
    );
  });

  it('should throw UnauthorizedError if Authorization header is malformed', function () {
    const req = {
      get: function (headerName) {
        return 'xyz';
      }
    };

    expect(checkAuthMiddleware.bind(this, req, {}, () => {})).to.throw(
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
