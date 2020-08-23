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

// TODO: Return for owner or if user is a collaborator
exports.getHouseList = async function (req, res, next) {
  try {
    const userId = req.userData.id;

    // get house list
    let houseList = await House.find({ owner: userId });
    
    res.status(200).json(houseList);
  } catch (error) {
    next(error);
  }
};

// TODO: Return for owner or if user is a collaborator
exports.getHouse = async function (req, res, next) {
  try {
    const houseId = req.params.id;
    //get house
    let requestedHouse = await House.findOne({_id: houseId});

    // if user is not an owner of requested house
    if(requestedHouse.owner != req.userData.id) {
      return res.status(403).json({message: 'You are not an owner of the requested house'});
    }

    res.status(200).json(requestedHouse);
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
    const houseId = req.params.id;
    // get house
    let house = await House.findOne({_id: houseId});

    if(req.userData.id != house.owner) {
      return res.status(403).json({message:'You are not the owher owner of this house.'});
    }

    await house.delete();

    res.status(200).json({ message: 'House deleted.' });
  } catch (error) {
    next(error);
  }
};
