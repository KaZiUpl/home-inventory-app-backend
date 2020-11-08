const HousesService = require('../services/houses.service');

exports.createHouse = async function (req, res, next) {
  try {
    let houseId = await HousesService.createHouse(
      req.userData.id,
      req.body.name,
      req.body.description
    );

    return res.status(201).json({ message: 'House created.', id: houseId });
  } catch (error) {
    next(error);
  }
};

exports.createRoom = async function (req, res, next) {
  try {
    await HousesService.checkHouseOwnership(req.params.id, req.userData.id);

    let roomId = await HousesService.createRoom(
      req.params.id,
      req.body.name,
      req.body.description
    );

    return res.status(201).json({ message: 'Room created.', id: roomId });
  } catch (error) {
    next(error);
  }
};

exports.getRooms = async function (req, res, next) {
  try {
    await HousesService.checkHouseAccess(req.params.id, req.userData.id);

    let rooms = await HousesService.getRooms(req.params.id);

    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

exports.addCollaborator = async function (req, res, next) {
  try {
    await HousesService.checkHouseOwnership(req.params.id, req.userData.id);

    await HousesService.addCollaborator(req.params.id, req.body.name);

    return res.status(200).json({ message: 'Collaborator added.' });
  } catch (error) {
    next(error);
  }
};

exports.getHouseList = async function (req, res, next) {
  try {
    let houseList = await HousesService.getHouseList(req.userData.id);

    return res.status(200).json(houseList);
  } catch (error) {
    next(error);
  }
};

exports.getCollaborators = async function (req, res, next) {
  try {
    await HousesService.checkHouseAccess(req.params.id, req.userData.id);

    let collaboratorsList = await HousesService.getCollaborators(req.params.id);

    return res.status(200).json(collaboratorsList);
  } catch (error) {
    next(error);
  }
};

exports.getHouse = async function (req, res, next) {
  try {
    await HousesService.checkHouseAccess(req.params.id, req.userData.id);

    let house = await HousesService.getHouse(req.params.id);

    return res.status(200).json(house);
  } catch (error) {
    next(error);
  }
};

exports.editHouse = async function (req, res, next) {
  try {
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
    await HousesService.checkHouseOwnership(req.params.id, req.userData.id);

    await HousesService.deleteHouse(req.params.id);

    return res.status(200).json({ message: 'House deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.deleteCollaborator = async function (req, res, next) {
  try {
    await HousesService.checkHouseOwnership(req.params.id, req.userData.id);

    await HousesService.deleteCollaborator(req.params.id, req.params.userId);

    return res.status(200).json({ message: 'Collaborator deleted.' });
  } catch (error) {
    next(error);
  }
};