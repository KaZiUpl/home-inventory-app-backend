const House = require('../models/house.model');
const Room = require('../models/room.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

const {
  ForbiddenError,
  NotFoundError,
  BadRequestError
} = require('../error/errors');

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
      throw new BadRequestError({
        message: 'No user with such login or email'
      });
    }

    //check if user is already a collaborator or owner
    if (house.owner._id.equals(user._id)) {
      throw new BadRequestError({
        message: 'You cannot add yourself as a collaborator'
      });
    }
    if (house.collaborators.filter((id) => user._id.equals(id)).length != 0) {
      throw new BadRequestError({
        message: 'This user is already a collaborator'
      });
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
      throw new NotFoundError({
        message: 'The requested house does not exist'
      });
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
      throw new NotFoundError({
        message: 'The requested house does not exist'
      });
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
      throw new NotFoundError({
        message: 'The requested house does not exist'
      });
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
      throw new BadRequestError('Collaborator id cannot be null');
    }
    let house = await House.findById(houseId);

    if (house == null) {
      throw new NotFoundError({
        message: 'The requested house does not exist'
      });
    }

    house.collaborators = house.collaborators.filter(
      (element) => element != collaboratorId
    );
    await house.save();
  } catch (error) {
    throw error;
  }
};

exports.getStorage = async function (houseId) {
  try {
    houseId = mongoose.Types.ObjectId(houseId);

    let house = House.aggregate([{ $match: { _id: houseId } }]);

    if ((await house.exec()).length === 0) {
      throw new BadRequestError('House does not exist');
    }

    house.append([
      {
        $lookup: {
          from: 'rooms',
          localField: 'rooms',
          foreignField: '_id',
          as: 'rooms'
        }
      },
      { $unwind: '$rooms' },
      { $unwind: '$rooms.storage' },
      {
        $lookup: {
          from: 'items',
          localField: 'rooms.storage.item',
          foreignField: '_id',
          as: 'rooms.storage.item'
        }
      },
      {
        $addFields: {
          'rooms.storage.item': { $arrayElemAt: ['$rooms.storage.item', 0] },
          'rooms.storage.room._id': '$rooms._id',
          'rooms.storage.room.name': '$rooms.name'
        }
      },
      { $group: { _id: null, root: { $push: '$rooms.storage' } } },
      { $unwind: '$root' },
      { $replaceRoot: { newRoot: '$root' } }
    ]);
    //TODO: filtering
    let items = await house.exec();
    return items;
  } catch (error) {
    throw error;
  }
};

exports.checkHouseExistence = async function (houseId) {
  try {
    let house = await House.findById(houseId);

    if (house == undefined) {
      throw new NotFoundError('House does not exist');
    }
  } catch (error) {
    throw error;
  }
};

exports.checkHouseOwnership = async function (houseId, userId) {
  try {
    let house = await House.find({ owner: userId, _id: houseId });

    if (house.length == 0) {
      throw new ForbiddenError({
        message: 'You are not an owner of this house'
      });
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
