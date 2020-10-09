const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const dotenv = require('../config/index');
const User = require('../models/user.model');
const {
  BadRequestError,
  ForbiddenError,
  InternalServerError
} = require('../error/errors');

exports.createNewUser = async function (req) {
  try {
    let newUser = new User({
      login: req.body.login,
      email: req.body.email,
      password: req.body.password
    });
    //check for duplicate login
    let user = await User.findOne({ login: newUser.login });
    if (user !== null) {
      throw new BadRequestError('User with such login already exist.');
    }
    //check for duplicate email
    user = await User.findOne({ email: newUser.email });
    if (user !== null) {
      throw new BadRequestError('User with such email already exist.');
    }
    //add new user
    //set password
    let passwordHash = await bcrypt.hash(newUser.password, 10);
    newUser.password = passwordHash;
    //set role
    newUser.role = 'user';
    await newUser.save();

    return { message: 'User created.' };
  } catch (error) {
    throw error;
  }
};

exports.modifyUser = async function (req) {
  try {
    //check whether user is trying to change his data
    if (req.params.id != req.userData.id) {
      throw new ForbiddenError("You can't modify other user's profile");
    }
    // check for login duplicate
    let user = await User.findOne({ login: req.body.login });
    if (user !== null) {
      throw new BadRequestError('Login is already in use.');
    }
    // change login
    await User.update(
      { _id: req.userData.id },
      { $set: { login: req.body.login } }
    );

    return { message: 'User modified.' };
  } catch (error) {
    throw error;
  }
};

exports.getUser = async function (req) {
  try {
    //check whether user is requesting his info
    if (req.params.id != req.userData.id) {
      throw new ForbiddenError('You do not have access to this resource.');
    }
    let user = await User.findById(req.params.id).select(
      '-refresh_token -password -_id'
    );

    if (user === null) {
      throw new InternalServerError();
    }

    return { user };
  } catch (error) {
    throw error;
  }
};

exports.login = async function (req) {
  try {
    let credentials = new User({
      login: req.body.login,
      password: req.body.password
    });
    let user;
    if (validateEmail(credentials.login)) {
      user = await User.findOne({
        email: credentials.login
      });
    } else {
      user = await User.findOne({
        login: credentials.login
      });
    }

    // user not found, wrong username
    if (user === null) {
      throw new BadRequestError('Wrong credentials');
    }
    // user exists
    let passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password
    );
    // wrong password
    if (!passwordMatch) {
      throw new BadRequestError('Wrong credentials');
    }
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
      dotenv.jwtSecret
    );

    let refreshToken;
    // create refresh token
    if (user.refresh_token) {
      refreshToken = user.refresh_token;
    } else {
      const refreshTokenTimestamp =
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
      refreshToken = jwt.sign(
        {
          login: user.login,
          email: user.email,
          id: user._id,
          role: user.role,
          exp: refreshTokenTimestamp
        },
        dotenv.jwtSecret
      );
    }

    // add refresh token to database
    user.refresh_token = refreshToken;
    await user.save();

    // return token output
    return {
      access_token: token,
      refresh_token: refreshToken,
      expires: tokenExpDate,
      id: user._id,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    throw error;
  }
};

exports.refreshToken = async function (req) {
  try {
    // get user with provided refresh token
    let user = await User.findOne({ refresh_token: req.body.token });
    // if user is not logged in
    if (user === null) {
      throw new BadRequestError('User not logged in');
    }

    // create new access token
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
      dotenv.jwtSecret
    );

    // return token output
    return {
      access_token: token,
      refresh_token: user.refresh_token,
      expires: tokenExpDate,
      id: user._id,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    throw error;
  }
};

exports.logout = async function (req) {
  try {
    let user = await User.findOne({ refresh_token: req.body.token });
    // user with provided token does not exist
    if (user === null) {
      return { message: 'User logged out.' };
    }
    // delete refresh token
    user.refresh_token = undefined;
    await user.save();
    return { message: 'User logged out.' };
  } catch (error) {
    throw error;
  }
};

exports.changeLogin = async function (req) {
  try {
    //check whether user is requesting his info
    if (req.params.id != req.userData.id) {
      throw new ForbiddenError('You do not have access to this resource.');
    }
    let user = await User.findOne({ email: req.userData.email });
    // if new login is the same
    if (user.login == req.body.login) {
      return { message: 'Login changed successfully.' };
    }
    // check whether new login is taken
    let newLogin = await User.findOne({ login: req.body.login });
    if (newLogin !== null) {
      throw new BadRequestError('Login already in use.');
    }

    user.login = req.body.login;
    await user.save();

    return { message: 'Login changed successfully.' };
  } catch (error) {
    throw error;
  }
};

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
