const Room = require('../models/room.model');
const House = require('../models/house.model');

const RoomsService = require('../services/rooms.service');

exports.modifyRoom = async function (req, res, next) {
  try {
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
    await RoomsService.checkRoomAccess(req.params.id, req.userData.id);

    let room = await RoomsService.getRoom(req.params.id);

    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async function (req, res, next) {
  try {
    await RoomsService.checkRoomOwnership(req.params.id, req.userData.id);

    await RoomsService.deleteRoom(req.params.id);

    res.status(200).json({ message: 'Room deleted.' });
  } catch (error) {
    next(error);
  }
};
