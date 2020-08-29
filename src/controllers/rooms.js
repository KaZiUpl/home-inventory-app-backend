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

// TODO: implementation
exports.modifyRoom = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'Room modified.' });
  } catch (error) {
    next(error);
  }
};

// TODO: implementation
exports.getRooms = async function (req, res, next) {
  try {
    return res.status(200).json({ message: 'Rooms array.' });
  } catch (error) {
    next(error);
  }
};

// TODO: implementation
exports.getRoom = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'Room created.' });
  } catch (error) {
    next(error);
  }
};

// TODO: implementation
exports.deleteRoom = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'Room deleted.' });
  } catch (error) {
    next(error);
  }
};
