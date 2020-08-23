const House = require('../models/house.model');

exports.createHouse = async function (req, res, next) {
  try {
    const ownerId = req.userData.id;
    const newHouse = new House();
    // assign name and description
    if (req.body.name == undefined) {
      return res.status(422).json({ message: 'Missing name' });
    }
    newHouse.name = req.body.name;
    newHouse.description = req.body.description;
    newHouse.owner = ownerId;

    await newHouse.save();

    res.status(200).json({ message: 'House created.' });
  } catch (error) {
    next(error);
  }
};

exports.getHouseList = async function (req, res, next) {
  try {
    const userId = req.userData.id;
    // get house list
    let houseList = await House.find({ owner: userId }).select(['-owner']);
    
    res.status(200).json(houseList);
  } catch (error) {
    next(error);
  }
};

exports.getHouse = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'House placeholder' });
  } catch (error) {
    next(error);
  }
};

exports.editHouse = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'House updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteHouse = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'House deleted' });
  } catch (error) {
    next(error);
  }
};
