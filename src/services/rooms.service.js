const Room = require('../models/room.model');
const House = require('../models/house.model');

const { ForbiddenError, NotFoundError } = require('../error/errors');

exports.modifyRoom = async function (roomId, name, description) {
  try {
    let room = await Room.findById(roomId);
    if (room == undefined) {
      throw new Error('Room not found.');
    }

    room.name = name;
    room.description = description;
    await room.save();
  } catch (error) {
    throw error;
  }
};

exports.getRoom = async function (id) {
  try {
    let room = await Room.findById(id);

    if (room == undefined) {
      throw new Error('Room not found.');
    }

    return room;
  } catch (error) {
    throw error;
  }
};

exports.deleteRoom = async function (id) {
  try {
    let room = await Room.findById(id);
    if (room == undefined) {
      throw new Error('Room not found.');
    }

    await room.delete();

    //update connected House
    await House.updateOne({ _id: room.house, $pull: { rooms: room._id } });
  } catch (error) {
    throw error;
  }
};

exports.addStorageItem = async function (
  roomId,
  itemId,
  quantity,
  expiration = null,
  description = null
) {
  try {
  } catch (error) {
    throw error;
  }
};

exports.getRoomStorage = async function (roomId) {
  try {
  } catch (error) {
    throw error;
  }
};

exports.getStorageItem = async function (roomId, itemId) {
  try {
  } catch (error) {
    throw error;
  }
};

exports.updateStorageItem = async function (roomId, itemId, newItemData) {
  try {
  } catch (error) {
    throw error;
  }
};

exports.deleteStorageItem = async function (roomId, itemId) {
  try {
  } catch (error) {
    throw error;
  }
};

exports.checkRoomExistence = async function (roomId) {
  try {
    let room = await Room.findById(roomId);

    if (room == undefined) {
      throw new NotFoundError('Room not found.');
    }
  } catch (error) {
    throw error;
  }
};

exports.checkRoomAccess = async function (roomId, userId) {
  try {
    let house = await House.find({
      rooms: roomId,
      $or: [{ owner: userId }, { collaborators: userId }]
    });
    if (house.length == 0) {
      throw new ForbiddenError();
    }
  } catch (error) {
    throw error;
  }
};

exports.checkRoomOwnership = async function (roomId, userId) {
  try {
    let house = await House.find({ owner: userId, rooms: roomId });
    if (house.length == 0) {
      throw new ForbiddenError();
    }
  } catch (error) {
    throw error;
  }
};
