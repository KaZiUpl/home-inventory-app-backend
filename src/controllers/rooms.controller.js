const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const RoomsService = require('../services/rooms.service');
const {
  UnprocessableEntityError,
  BadRequestError
} = require('../error/errors');

exports.modifyRoom = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
  }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Room id is invalid');
    }

    await RoomsService.checkRoomExistence(req.params.id);

    await RoomsService.checkRoomOwnership(req.params.id, req.userData.id);

    await RoomsService.modifyRoom(
      req.params.id,
      req.body.name,
      req.body.description
    );

    res.status(200).json({ message: 'Room modified' });
  } catch (error) {
    next(error);
  }
};

exports.getRoom = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Room id is invalid');
    }

    await RoomsService.checkRoomExistence(req.params.id);

    await RoomsService.checkRoomAccess(req.params.id, req.userData.id);

    let room = await RoomsService.getRoom(req.params.id);

    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Room id is invalid');
    }

    await RoomsService.checkRoomExistence(req.params.id);

    await RoomsService.checkRoomOwnership(req.params.id, req.userData.id);

    await RoomsService.deleteRoom(req.params.id);

    res.status(200).json({ message: 'Room deleted' });
  } catch (error) {
    next(error);
  }
};

exports.addStorageItem = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
  }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Room id is invalid');
    }
    if (!mongoose.isValidObjectId(req.body.item)) {
      throw new BadRequestError('Item id is invalid');
    }
    await RoomsService.checkRoomExistence(req.params.id);

    await RoomsService.checkRoomAccess(req.params.id, req.userData.id);

    await RoomsService.checkItemAccess(
      req.body.item,
      req.params.id,
      req.userData.id
    );

    let storageItemId = await RoomsService.addStorageItem(
      req.params.id,
      req.body.item,
      req.body.quantity,
      req.body.expiration ? req.body.expiration : undefined,
      req.body.description ? req.body.description : undefined
    );

    res
      .status(200)
      .json({ message: 'Storage item added to the room', id: storageItemId });
  } catch (error) {
    next(error);
  }
};

exports.getRoomStorage = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('Room id is invalid');
    }

    await RoomsService.checkRoomExistence(req.params.id);

    await RoomsService.checkRoomAccess(req.params.id, req.userData.id);

    let storage = await RoomsService.getRoomStorage(req.params.id);

    res.status(200).json(storage);
  } catch (error) {
    next(error);
  }
};

exports.getStorageItem = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.roomId)) {
      throw new BadRequestError('Room id is invalid');
    }
    if (!mongoose.isValidObjectId(req.params.storageId)) {
      throw new BadRequestError('Storage item id is invalid');
    }

    await RoomsService.checkRoomExistence(req.params.roomId);

    await RoomsService.checkRoomAccess(req.params.roomId, req.userData.id);

    let storageItem = await RoomsService.getStorageItem(
      req.params.roomId,
      req.params.storageId
    );
    res.status(200).json(storageItem);
  } catch (error) {
    next(error);
  }
};

exports.updateStorageItem = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
  }
  try {
    if (!mongoose.isValidObjectId(req.params.roomId)) {
      throw new BadRequestError('Room id is invalid');
    }
    if (!mongoose.isValidObjectId(req.params.storageId)) {
      throw new BadRequestError('Storage item id is invalid');
    }

    await RoomsService.checkRoomExistence(req.params.roomId);

    await RoomsService.checkRoomAccess(req.params.roomId, req.userData.id);

    await RoomsService.updateStorageItem(
      req.params.roomId,
      req.params.storageId,
      req.body
    );

    res.status(200).json({ message: 'Storage item updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteStorageItem = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.roomId)) {
      throw new BadRequestError('Room id is invalid');
    }
    if (!mongoose.isValidObjectId(req.params.storageId)) {
      throw new BadRequestError('Storage item id is invalid');
    }

    await RoomsService.checkRoomExistence(req.params.roomId);

    await RoomsService.checkRoomAccess(req.params.roomId, req.userData.id);

    await RoomsService.deleteStorageItem(
      req.params.roomId,
      req.params.storageId
    );

    res.status(200).json({ message: 'Storage item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
