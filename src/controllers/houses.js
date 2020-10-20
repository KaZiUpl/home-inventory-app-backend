const House = require('../models/house.model');
const Room = require('../models/room.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

const {
  BadRequestError,
  UnprocessableEntityError,
  ForbiddenError,
  NotFoundError
} = require('../error/errors');

exports.createHouse = async function (req) {
  try {
    const ownerId = req.userData.id;
    const newHouse = new House();
    // assign name and description
    if (req.body.name == undefined) {
      throw new UnprocessableEntityError('Missing name');
    }
    newHouse.name = req.body.name;
    newHouse.description = req.body.description;
    newHouse.owner = ownerId;

    let createdHouse = await newHouse.save();

    return { message: 'House created.', id: createdHouse._id };
  } catch (error) {
    throw error;
  }
};

exports.createRoom = async function (req, res, next) {
  try {
    const houseId = req.params.id;
    let newRoom = new Room();

    newRoom.name = req.body.name;
    if (req.body.description) {
      newRoom.description = req.body.description;
    }
    newRoom.house = houseId;
    // get house for update
    let house = await House.findOne({ _id: houseId });
    if (req.userData.id != house.owner) {
      return res.status(403).json({
        message: 'You have to be the owner of the house to add rooms.'
      });
    }

    //create a room and push id into rooms array on house
    newRoom = await newRoom.save();
    house.rooms.push(newRoom._id);
    let createdRoom = await house.save();

    return res
      .status(201)
      .json({ message: 'Room created.', id: createdRoom._id });
  } catch (error) {
    next(error);
  }
};

exports.addCollaborator = async function (req, res, next) {
  try {
    const houseId = req.params.id;
    let house = await House.findOne({ _id: houseId });
    if (house.owner != req.userData.id) {
      return res.status(403).json({
        message: 'You have to be the owner of the house to add a collaborator.'
      });
    }

    const name = req.body.name;
    let user = await User.findOne({ $or: [{ login: name }, { email: name }] });
    if (user == null) {
      return res
        .status(404)
        .json({ message: 'No user with provided login or email.' });
    }

    house.collaborators.push(user._id);
    await house.save();

    return res.status(200).json({ message: 'Collaborator added.' });
  } catch (error) {
    next(error);
  }
};

exports.getHouseList = async function (req) {
  try {
    const userId = req.userData.id;

    // get house list
    let houseList = await House.find({
      $or: [{ owner: userId }, { collaborators: userId }]
    }).populate('owner', 'login');

    return houseList;
  } catch (error) {
    throw error;
  }
};

exports.getCollaborators = async function (req, res, next) {
  try {
    const houseId = req.params.id;

    let house = await await await House.findOne({ _id: houseId })
      .populate('owner', 'login')
      .populate('collaborators', 'login');

    // check whether requesting user is either owner or a collaborator
    if (
      house.owner._id != req.userData.id &&
      house.collaborators.find((collab) => collab._id == req.userData.id) ==
        undefined
    ) {
      return res
        .status(403)
        .json({ message: 'You do not have access to this resource.' });
    }

    return res.status(200).json(house.collaborators);
  } catch (error) {
    next(error);
  }
};

exports.getHouse = async function (req) {
  try {
    const houseId = req.params.id;
    //get house
    let requestedHouse = await House.findById(houseId)
      .populate('owner', 'login')
      .populate('collaborators', 'login')
      .populate('rooms', 'name description');
    // if user is not an owner or collaborator of requested house
    if (
      !requestedHouse.owner._id.equals(req.userData.id) &&
      requestedHouse.collaborators.filter((element) =>
        element._id.equals(req.userData.id)
      ).length == 0
    ) {
      throw new ForbiddenError(
        'You are not an owner nor the collaborator of the requested house'
      );
    }

    return requestedHouse;
  } catch (error) {
    throw error;
  }
};

exports.editHouse = async function (req) {
  try {
    const houseId = req.params.id;

    let house = await House.findOne({ _id: houseId });
    if (house == null) {
      throw new NotFoundError('The requested house does not exist');
    }

    if (!house.owner.equals(req.userData.id)) {
      throw new ForbiddenError('You are not an owner of the requested house');
    }

    house.name = req.body.name;
    house.description = req.body.description;
    await house.save();

    return { message: 'House info updated' };
  } catch (error) {
    throw error;
  }
};

exports.deleteHouse = async function (req) {
  try {
    const houseId = req.params.id;
    // get house
    let house = await House.findOne({ _id: houseId });
    if (house == null) {
      return { message: 'House deleted.' };
    }
    if (!house.owner.equals(req.userData.id)) {
      throw new ForbiddenError('You are not the owner owner of this house.');
    }

    await Room.deleteMany({ house: house._id });
    await house.delete();

    return { message: 'House deleted.' };
  } catch (error) {
    throw error;
  }
};

exports.deleteCollaborator = async function (req, res, next) {
  try {
    const houseId = req.params.id;
    const collaboratorId = req.params.userId;
    let house = await House.findById(houseId);
    if (house == null) {
      return res
        .status(404)
        .json({ message: 'House with such id does not exist.' });
    }

    if (house.owner != req.userData.id) {
      res.status(403).json({ message: 'You are not the owner of this house.' });
    }

    house.collaborators = house.collaborators.filter(
      (element) => element != collaboratorId
    );
    await house.save();

    return res.status(200).json({ message: 'Collaborator deleted.' });
  } catch (error) {
    next(error);
  }
};
