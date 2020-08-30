const Room = require('../models/room.model');
const House = require('../models/house.model');

exports.createRoom = async function (req, res, next) {
  try {
    const houseId = req.params.id;
    let newRoom = new Room();

    newRoom.name = req.body.name;
    if (req.body.description) {
      newRoom.description = req.body.description;
    }
    newRoom.house = houseId;
    // get house for update
    let house = await House.findOne({ _id: houseId });
    if (req.userData.id != house.owner) {
      return res.status(403).json({
        message: 'You have to be the owner of the house to add rooms.'
      });
    }

    //create a room and push id into rooms array on house
    newRoom = await newRoom.save();
    house.rooms.push(newRoom._id);
    await house.save();

    return res.status(200).json({ message: 'Room created.' });
  } catch (error) {
    next(error);
  }
};

exports.modifyRoom = async function (req, res, next) {
  try {
    const roomId = req.params.id;

    let room = await Room.findById(roomId);
    if (room == undefined) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    //check whether user is able to modify a room
    let house = await House.findOne({ owner: req.userData.id, rooms: roomId });
    if (house == undefined) {
      return res
        .status(403)
        .json({ message: 'You do not have access to this resource.' });
    }

    room.name = req.body.name;
    room.description = req.body.description;
    await room.save();

    res.status(200).json({ message: 'Room modified.' });
  } catch (error) {
    next(error);
  }
};

exports.getRooms = async function (req, res, next) {
  try {
    const houseId = req.params.id;
    //check if user is an owner or collaborator
    let house = await House.findOne({
      _id: houseId,
      $or: [{ owner: req.userData.id }, { collaborators: req.userData.id }]
    });

    if (house == undefined) {
      return res
        .status(403)
        .json({ message: 'You do not have access to this resource.' });
    }
    //get rooms
    let rooms = await Room.find({ house: houseId });

    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

exports.getRoom = async function (req, res, next) {
  try {
    const roomId = req.params.id;

    let room = await Room.findById(roomId);
    if (room == undefined) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    //check whether the user has access to this room info
    let house = await House.findOne({
      rooms: roomId,
      $or: [{ owner: req.userData.id }, { collaborators: req.userData.id }]
    });

    if (house == undefined) {
      return res
        .status(403)
        .json({ message: 'You do not have access to this resource.' });
    }

    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async function (req, res, next) {
  try {
    const roomId = req.params.id;

    let room = await Room.findById(roomId);
    if (room == undefined) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    //check whether the user has access to this room info
    let house = await House.findOne({
      rooms: roomId,
      $or: [{ owner: req.userData.id }, { collaborator: req.userData.id }]
    });

    if (house == undefined) {
      return res
        .status(403)
        .json({ message: 'You do not have access to this resource.' });
    }

    await room.delete();
    await house.updateOne({ $pull: { rooms: room._id } });

    res.status(200).json({ message: 'Room deleted.' });
  } catch (error) {
    next(error);
  }
};
