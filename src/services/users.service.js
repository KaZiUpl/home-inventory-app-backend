const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const dotenv = require('../config/dotenv');
const User = require('../models/user.model');

exports.createUser = async function (login, email, password) {
  try {
    let newUser = new User({
      login: login,
      email: email,
      password: password
    });
    //check for duplicate login
    let user = await User.findOne({ login: newUser.login });
    if (user !== null) {
      throw new Error('User with such login already exist.');
    }
    //check for duplicate email
    user = await User.findOne({ email: newUser.email });
    if (user !== null) {
      throw new Error('User with such email already exist.');
    }
    //add new user
    //set password
    let passwordHash = await bcrypt.hash(newUser.password, 10);
    newUser.password = passwordHash;
    //set role
    newUser.role = 'user';
    newUser = await newUser.save();

    return newUser._id;
  } catch (error) {
    throw error;
  }
};

exports.modifyUser = async function (id, data) {
  try {
    let user = await User.findOne({ login: data.login });
    if (user != undefined) {
      throw new Error('Login is taken');
    }
    // change login
    await User.updateOne({ _id: id }, { $set: { login: data.login } });

    return;
  } catch (error) {
    throw error;
  }
};

exports.getUser = async function (id) {
  try {
    if (id == null) {
      throw new Error();
    }
    let user = await User.findById(id).select('-refresh_token -password -_id');

    if (user == undefined) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

exports.login = async function (login, password) {
  try {
    let credentials = new User({
      login: login,
      password: password
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
      throw new Error('Wrong credentials');
    }
    // user exists
    let passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password
    );
    // wrong password
    if (!passwordMatch) {
      throw new Error('Wrong credentials');
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

exports.refreshToken = async function (refresh_token) {
  try {
    if (refresh_token == null) {
      throw new Error('');
    }
    // get user with provided refresh token
    let user = await User.findOne({ refresh_token: refresh_token });
    // if user is not logged in
    if (user === null) {
      throw new Error('User not logged in');
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

exports.logout = async function (refresh_token) {
  try {
    let user = await User.findOne({ refresh_token: refresh_token });
    // user with provided token does not exist
    if (user === null) {
      throw new Error('User not logged in or refresh token is invalid.');
    }
    // delete refresh token
    user.refresh_token = undefined;
    await user.save();
  } catch (error) {
    throw error;
  }
};

exports.changeLogin = async function (userId, newLogin) {
  try {
    let existingUser = await User.findOne({ login: newLogin });
    if (existingUser != undefined) {
      throw new Error('Login is taken');
    }
    let user = await User.findById(userId);
    // if new login is the same
    if (user.login == this.newLogin) {
      return;
    }
    // check whether new login is taken
    let checkLogin = await User.findOne(User({ login: newLogin }));
    if (checkLogin !== null) {
      throw new Error('Login already in use.');
    }

    user.login = newLogin;
    await user.save();
  } catch (error) {
    throw error;
  }
};

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
