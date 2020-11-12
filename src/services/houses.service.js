const House = require('../models/house.model');
const Room = require('../models/room.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

const { ForbiddenError, NotFoundError } = require('../error/errors');

exports.createHouse = async function (userId, name, description) {
  try {
    let createdHouse = await House.create({
      name: name,
      description: description,
      owner: userId
    });

    return createdHouse._id;
  } catch (error) {
    throw error;
  }
};

exports.createRoom = async function (houseId, name, description) {
  try {
    let newRoom = new Room();

    newRoom.name = name;
    if (description) {
      newRoom.description = description;
    }
    newRoom.house = houseId;
    // get house for update
    let house = await House.findOne({ _id: houseId });

    //create a room and push id into rooms array on house
    newRoom = await newRoom.save();
    house.rooms.push(newRoom._id);
    await house.save();

    return newRoom._id;
  } catch (error) {
    throw error;
  }
};

exports.getRooms = async function (houseId) {
  try {
    let house = await House.findById(houseId).populate('rooms');

    return house.rooms;
  } catch (error) {
    throw error;
  }
};

exports.addCollaborator = async function (houseId, collaboratorLogin) {
  try {
    let house = await House.findOne({ _id: houseId });

    //find user with provided login/email
    let user = await User.findOne({
      $or: [{ login: collaboratorLogin }, { email: collaboratorLogin }]
    });
    if (user == null) {
      throw new Error('No user with such login or email.');
    }

    //check if user is already a collaborator or owner
    if (house.owner._id.equals(user._id)) {
      throw new Error('You cannot add yourself as a collaborator.');
    }
    if (house.collaborators.filter((id) => user._id.equals(id)).length != 0) {
      throw new Error('This user is already a collaborator.');
    }

    house.collaborators.push(user._id);
    await house.save();
  } catch (error) {
    throw error;
  }
};

exports.getHouseList = async function (userId) {
  try {
    // get house list
    let houseList = await House.find({
      $or: [{ owner: userId }, { collaborators: userId }]
    }).populate('owner', 'login');

    return houseList;
  } catch (error) {
    throw error;
  }
};

exports.getCollaborators = async function (houseId) {
  try {
    let house = await House.findById(houseId).populate(
      'collaborators',
      'login'
    );

    return house.collaborators;
  } catch (error) {
    throw error;
  }
};

exports.getHouse = async function (houseId) {
  try {
    //get house
    let requestedHouse = await House.findById(houseId)
      .populate('owner', 'login')
      .populate('collaborators', 'login')
      .populate('rooms', 'name description');
    if (requestedHouse == null) {
      throw new Error('The requested house does not exist');
    }
    return requestedHouse;
  } catch (error) {
    throw error;
  }
};

exports.editHouse = async function (houseId, newName, newDescription) {
  try {
    let house = await House.findOne({ _id: houseId });
    if (house == null) {
      throw new Error('The requested house does not exist');
    }
    house.name = newName;
    house.description = newDescription;
    await house.save();
  } catch (error) {
    throw error;
  }
};

exports.deleteHouse = async function (houseId) {
  try {
    // get house
    let house = await House.findOne({ _id: houseId });
    if (house == null) {
      throw new Error('The requested house does not exist');
    }

    await Room.deleteMany({ house: house._id });
    await house.deleteOne();
  } catch (error) {
    throw error;
  }
};

exports.deleteCollaborator = async function (houseId, collaboratorId) {
  try {
    if (collaboratorId == null) {
      throw new Error();
    }
    let house = await House.findById(houseId);

    if (house == null) {
      throw new Error('The requested house does not exist');
    }

    house.collaborators = house.collaborators.filter(
      (element) => element != collaboratorId
    );
    await house.save();
  } catch (error) {
    throw error;
  }
};

exports.checkHouseExistence = async function (houseId) {
  try {
    let house = await House.findById(houseId);

    if (house == undefined) {
      throw new NotFoundError();
    }
  } catch (error) {
    throw error;
  }
};

exports.checkHouseOwnership = async function (houseId, userId) {
  try {
    let house = await House.find({ owner: userId, _id: houseId });

    if (house.length == 0) {
      throw new ForbiddenError('You are not an owner of this house.');
    }
  } catch (error) {
    throw error;
  }
};

exports.checkHouseAccess = async function (houseId, userId) {
  try {
    let house = await House.findOne({
      _id: houseId,
      $or: [{ owner: userId }, { collaborators: userId }]
    });
    if (house == undefined) {
      throw new ForbiddenError();
    }
  } catch (error) {
    throw error;
  }
};
