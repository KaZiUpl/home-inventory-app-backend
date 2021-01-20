const mongoose = require('mongoose');

const Room = require('../models/room.model');
const House = require('../models/house.model');
const Item = require('../models/item.model');

const {
  ForbiddenError,
  NotFoundError,
  BadRequestError
} = require('../error/errors');

exports.modifyRoom = async function (roomId, name, description) {
  try {
    let room = await Room.findById(roomId);
    if (room == undefined) {
      throw new NotFoundError('Room not found');
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
    let room = await Room.findById(id)
      .populate('house', 'name')
      .populate({ path: 'storage.item', select: '-owner' });

    if (room == undefined) {
      throw new NotFoundError('Room not found');
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
      throw new NotFoundError('Room not found');
    }

    //update connected House
    await House.updateOne(
      { _id: mongoose.Types.ObjectId(room.house) },
      {
        $pull: { rooms: room._id }
      }
    );

    await room.delete();
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
      throw new BadRequestError(
        'Item quantity must be greater than or equal to 1'
      );
    }
    if (expiration && typeof expiration !== 'number') {
      throw new BadRequestError('Expiration muse be a timestamp');
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
    let room = await Room.findById(roomId)
      .populate({
        path: 'storage',
        populate: { path: 'item' }
      })
      .populate({
        path: 'storage.item',
        populate: { path: 'owner', select: 'login' }
      });

    if (room == undefined) {
      throw new NotFoundError('Room not found');
    }

    return room.storage;
  } catch (error) {
    throw error;
  }
};

exports.getStorageItem = async function (roomId, itemId) {
  try {
    roomId = mongoose.Types.ObjectId(roomId);
    itemId = mongoose.Types.ObjectId(itemId);

    let room = await Room.findOne({
      _id: roomId
    }).populate('item');

    if (room == undefined) {
      throw new NotFoundError('Room not found');
    }

    let storageItem = await Room.aggregate([
      { $match: { _id: roomId } },
      {
        $project: {
          storage: {
            $filter: {
              input: '$storage',
              as: 'storageItem',
              cond: { $eq: ['$$storageItem._id', itemId] }
            }
          }
        }
      },
      { $unwind: '$storage' },
      {
        $lookup: {
          from: 'items',
          localField: 'storage.item',
          foreignField: '_id',
          as: 'storage.item'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'storage.item.owner',
          foreignField: '_id',
          as: 'itemOwner'
        }
      },
      {
        $project: {
          'itemOwner.email': 0,
          'itemOwner.password': 0,
          'itemOwner.role': 0,
          'itemOwner.refresh_token': 0,
          'itemOwner.__v': 0
        }
      },
      { $unwind: '$storage.item' },
      { $unwind: '$itemOwner' },
      { $set: { 'storage.item.owner': '$itemOwner' } },
      { $unset: 'itemOwner' }
    ]);

    if (storageItem[0] == undefined) {
      throw new NotFoundError('Item not found');
    }
    return storageItem[0].storage;
  } catch (error) {
    throw error;
  }
};

exports.updateStorageItem = async function (roomId, itemId, newItemData) {
  try {
    if (newItemData.quantity < 1) {
      throw new BadRequestError('Quantity must be greater or equal to 1');
    }
    let room = await Room.findById(roomId);
    if (room == undefined) {
      throw new NotFoundError('Room not found');
    }
    const updateBody = {
      'storage.$.quantity': newItemData.quantity
    };
    if (newItemData.expiration)
      updateBody['storage.$.expiration'] = newItemData.expiration;
    if (newItemData.description)
      updateBody['storage.$.description'] = newItemData.description;

    room = await Room.findOneAndUpdate(
      { _id: roomId, 'storage._id': itemId },
      updateBody
    );

    if (room == undefined) {
      throw new NotFoundError('Storage item not found');
    }
  } catch (error) {
    throw error;
  }
};

exports.deleteStorageItem = async function (roomId, itemId) {
  try {
    let room = await Room.findById(roomId);
    if (room == undefined) {
      throw new NotFoundError('Room not found');
    }
    room = await Room.findOne({ _id: roomId, 'storage._id': itemId });
    if (room == undefined) {
      throw new NotFoundError('Storage item not found');
    }
    room = await Room.findOneAndUpdate(
      { 'storage._id': itemId },
      { $pull: { storage: { _id: itemId } } }
    );
  } catch (error) {
    throw error;
  }
};

exports.checkRoomExistence = async function (roomId) {
  try {
    let room = await Room.findById(roomId);

    if (room == undefined) {
      throw new NotFoundError('Room not found');
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

exports.checkItemAccess = async function (itemId, roomId, userId) {
  try {
    let item = await Item.findById(itemId);
    if (item == undefined) {
      throw new NotFoundError('Item does not exist');
    }
    //global item
    if (!item.owner) {
      return;
    }
    //check if user and item's owner belong to the same house
    let house = await House.findOne({
      rooms: roomId,
      $or: [
        { $and: [{ owner: userId }, { owner: item.owner }] },
        { owner: userId, collaborators: item.owner },
        { owner: item.owner, collaborators: userId },
        { collaborators: { $all: [userId, item.owner] } }
      ]
    });

    if (house == undefined) {
      throw new ForbiddenError('You do not have access to that item');
    }
  } catch (error) {
    throw error;
  }
};
