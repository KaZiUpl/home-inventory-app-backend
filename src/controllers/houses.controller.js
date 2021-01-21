const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HousesService = require('../services/houses.service');

const {
  UnprocessableEntityError,
  BadRequestError
} = require('../error/errors');

exports.createHouse = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
    return;
  }
  try {
    await HousesService.checkHouseLimit(req.userData.id);

    let houseId = await HousesService.createHouse(
      req.userData.id,
      req.body.name,
      req.body.description
    );

    return res.status(201).json({ message: 'House created', id: houseId });
  } catch (error) {
    next(error);
  }
};

exports.createRoom = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
    return;
  }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('House id is invalid');
    }

    await HousesService.checkHouseExistence(req.params.id);

    await HousesService.checkHouseOwnership(req.params.id, req.userData.id);

    await HousesService.checkRoomLimit(req.params.id);

    let roomId = await HousesService.createRoom(
      req.params.id,
      req.body.name,
      req.body.description
    );

    return res.status(201).json({ message: 'Room created', id: roomId });
  } catch (error) {
    next(error);
  }
};

exports.getRooms = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('House id is invalid');
    }
    await HousesService.checkHouseExistence(req.params.id);

    await HousesService.checkHouseAccess(req.params.id, req.userData.id);

    let rooms = await HousesService.getRooms(req.params.id);

    //res.set('Cache-Control', 'private, max-age=300, must-revalidate');
    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

exports.addCollaborator = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
    return;
  }
  try {
    await HousesService.checkHouseExistence(req.params.id);

    await HousesService.checkHouseOwnership(req.params.id, req.userData.id);

    await HousesService.checkCollaboratorLimit(req.params.id);

    await HousesService.addCollaborator(req.params.id, req.body.name);

    return res.status(200).json({ message: 'Collaborator added' });
  } catch (error) {
    next(error);
  }
};

exports.getHouseList = async function (req, res, next) {
  try {
    let houseList = await HousesService.getHouseList(req.userData.id);

    //res.set('Cache-Control', 'private, max-age=60, must-revalidate');
    return res.status(200).json(houseList);
  } catch (error) {
    next(error);
  }
};

exports.getCollaborators = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('House id is invalid');
    }

    await HousesService.checkHouseExistence(req.params.id);

    await HousesService.checkHouseAccess(req.params.id, req.userData.id);

    let collaboratorsList = await HousesService.getCollaborators(req.params.id);

    //res.set('Cache-Control', 'private, max-age=300, must-revalidate');
    return res.status(200).json(collaboratorsList);
  } catch (error) {
    next(error);
  }
};

exports.getHouse = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('House id is invalid');
    }

    await HousesService.checkHouseExistence(req.params.id);

    await HousesService.checkHouseAccess(req.params.id, req.userData.id);

    let house = await HousesService.getHouse(req.params.id);

    //res.set('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json(house);
  } catch (error) {
    next(error);
  }
};

exports.editHouse = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
    return;
  }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('House id is invalid');
    }

    await HousesService.checkHouseExistence(req.params.id);

    await HousesService.checkHouseOwnership(req.params.id, req.userData.id);

    await HousesService.editHouse(
      req.params.id,
      req.body.name,
      req.body.description
    );

    return res.status(200).json({ message: 'House info updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteHouse = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('House id is invalid');
    }

    await HousesService.checkHouseExistence(req.params.id);

    await HousesService.checkHouseOwnership(req.params.id, req.userData.id);

    await HousesService.deleteHouse(req.params.id);

    return res.status(200).json({ message: 'House deleted' });
  } catch (error) {
    next(error);
  }
};

exports.deleteCollaborator = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('House id is invalid');
    }

    await HousesService.checkHouseExistence(req.params.id);

    await HousesService.checkHouseOwnership(req.params.id, req.userData.id);

    await HousesService.deleteCollaborator(req.params.id, req.params.userId);

    return res.status(200).json({ message: 'Collaborator deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getStorage = async function (req, res, next) {
  try {
    let storage = await HousesService.getStorage(req.userData.id);

    //res.set('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json(storage);
  } catch (error) {
    next(error);
  }
};

exports.getHouseStorage = async function (req, res, next) {
  try {
    await HousesService.checkHouseExistence(req.params.id);

    await HousesService.checkHouseAccess(req.params.id, req.userData.id);

    const name = req.query.name
      ? decodeURIComponent(req.query.name)
      : undefined;

    let items = await HousesService.getHouseStorage(req.params.id, name);

    //res.set('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};
