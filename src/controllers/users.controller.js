const express = require('express');

const UsersService = require('../services/users.service');
const { ForbiddenError } = require('../error/errors');

exports.createUser = async function (req, res, next) {
  // validate input
  try {
    let newUserId = await UsersService.createUser(
      req.body.login,
      req.body.email,
      req.body.password
    );

    return res
      .status(201)
      .json({ message: 'User created successfully.', id: newUserId });
  } catch (error) {
    if (error instanceof BadRequestError) {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

exports.putUser = async function (req, res, next) {
  try {
    //check whether user is trying to change his data
    if (req.params.id != req.userData.id) {
      throw new ForbiddenError("You can't modify other user's profile");
    }

    await UsersService.modifyUser(req.params.id, req.body);

    return res.status(200).json({ message: 'User modified.' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

exports.getUser = async function (req, res, next) {
  try {
    //check whether user is requesting his info
    if (req.params.id != req.userData.id) {
      throw new ForbiddenError();
    }
    let user = await UsersService.getUser(req.params.id);

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof BadRequestError) {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

exports.login = async function (req, res, next) {
  try {
    let tokenOutput = await UsersService.login(
      req.body.login,
      req.body.password
    );

    return res.status(200).json(tokenOutput);
  } catch (error) {
    if (error instanceof BadRequestError) {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

exports.refreshToken = async function (req, res, next) {
  try {
    let tokenOutput = await UsersService.refreshToken(req.body.refresh_token);

    return res.status(200).json(tokenOutput);
  } catch (error) {
    if (error instanceof BadRequestError) {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

exports.logout = async function (req, res, next) {
  try {
    await UsersService.logout(req.body.refresh_token);

    return res.status(200).json({ message: 'User logged out.' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

exports.changeLogin = async function (req, res, next) {
  try {
    //check whether user is requesting his info
    if (req.params.id != req.userData.id) {
      throw new ForbiddenError();
    }

    await UserService.changeLogin(req.params.id, req.body.login);

    return res.status(200).json({ message: 'Login changed successfully.' });
  } catch (error) {
    if (error instanceof BadRequestError) {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
