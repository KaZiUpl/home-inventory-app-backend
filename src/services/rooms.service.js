const Room = require('../models/room.model');
const House = require('../models/house.model');

const { ForbiddenError } = require('../error/errors');

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
