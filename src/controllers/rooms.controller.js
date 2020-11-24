const { validationResult } = require('express-validator');

const Room = require('../models/room.model');
const House = require('../models/house.model');

const RoomsService = require('../services/rooms.service');
const { UnprocessableEntityError } = require('../error/errors');

exports.modifyRoom = async function (req, res, next) {
  if (!validationResult(req).isEmpty()) {
    next(new UnprocessableEntityError());
  }
  try {
    await RoomsService.checkRoomExistence(req.params.id);

    await RoomsService.checkRoomOwnership(req.params.id, req.userData.id);

    await RoomsService.modifyRoom(
      req.params.id,
      req.body.name,
      req.body.description
    );

    res.status(200).json({ message: 'Room modified.' });
  } catch (error) {
    next(error);
  }
};

exports.getRoom = async function (req, res, next) {
  try {
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
    await RoomsService.checkRoomExistence(req.params.id);

    await RoomsService.checkRoomOwnership(req.params.id, req.userData.id);

    await RoomsService.deleteRoom(req.params.id);

    res.status(200).json({ message: 'Room deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.addStorageItem = async function (req, res, next) {
  try {
    res.json();
  } catch (error) {
    next(error);
  }
};

exports.getRoomStorage = async function (req, res, next) {
  try {
    res.json();
  } catch (error) {
    next(error);
  }
};

exports.getStorageItem = async function (req, res, next) {
  try {
    res.json();
  } catch (error) {
    next(error);
  }
};

exports.updateStorageItem = async function (req, res, next) {
  try {
    res.json();
  } catch (error) {
    next(error);
  }
};

exports.deleteStorageItem = async function (req, res, next) {
  try {
    res.json();
  } catch (error) {
    next(error);
  }
};
