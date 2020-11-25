const Room = require('../models/room.model');
const House = require('../models/house.model');
const Item = require('../models/item.model');

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
  expiration = undefined,
  description = undefined
) {
  try {
    let room = await Room.findById(roomId);
    let item = await Item.findById(itemId);
    if (room == null) {
      throw new NotFoundError('Room not found');
    }
    if (item == null) {
      throw new NotFoundError('Item not found');
    }
    if (quantity < 1) {
      throw new Error('Item quantity must be greater than or equal to 1');
    }
    if (expiration && typeof expiration !== 'number') {
      throw new Error('Expiration muse be a timestamp');
    }

    const storageItem = {
      item: itemId,
      quantity: quantity,
      expiration: expiration,
      description: description
    };

    let response = await room.storage.create(storageItem);
    room.storage.push(response);

    await room.save();

    return response._id;
  } catch (error) {
    throw error;
  }
};

exports.getRoomStorage = async function (roomId) {
  try {
    let room = await Room.findById(roomId).populate({
      path: 'storage',
      populate: { path: 'item' }
    });

    if (room == undefined) {
      throw new NotFoundError('Room not found.');
    }

    return room.storage;
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
