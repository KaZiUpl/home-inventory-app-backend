const House = require('../models/house.model');
const User = require('../models/user.model');

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

exports.addCollaborator = async function (req, res, next) {
  try {
    const houseId = req.params.id;
    let house = await House.findOne({ _id: houseId });
    if (house.owner != req.userData.id) {
      return res.status(403).json({
        message: 'You have to be the owner of the house to add a collaborator.'
      });
    }

    const name = req.body.name;
    let user = await User.findOne({ $or: [{ login: name }, { email: name }] });
    if (user == null) {
      return res
        .status(404)
        .json({ message: 'No user with provided login or email.' });
    }

    house.collaborators.push(user._id);
    await house.save();

    return res.status(200).json({ message: 'Collaborator added.' });
  } catch (error) {
    next(error);
  }
};

exports.getHouseList = async function (req, res, next) {
  try {
    const userId = req.userData.id;

    // get house list
    let houseList = await House.find({
      $or: [{ owner: userId }, { collaborators: userId }]
    }).populate('owner', 'login');

    res.status(200).json(houseList);
  } catch (error) {
    next(error);
  }
};

exports.getCollaborators = async function (req, res, next) {
  try {
    const houseId = req.params.id;

    let house = await await await House.findOne({ _id: houseId })
      .populate('owner', 'login')
      .populate('collaborators', 'login');

    // check whether requesting user is either owner or a collaborator
    if (
      house.owner._id != req.userData.id &&
      house.collaborators.find((collab) => collab._id == req.userData.id) ==
        undefined
    ) {
      return res
        .status(403)
        .json({ message: 'You do not have access to this resource.' });
    }

    return res.status(200).json(house.collaborators);
  } catch (error) {
    next(error);
  }
};

exports.getHouse = async function (req, res, next) {
  try {
    const houseId = req.params.id;
    //get house
    let requestedHouse = await House.findById(houseId)
      .populate('owner', 'login')
      .populate('collaborators', 'login')
      .populate('rooms', 'name description');

    // if user is not an owner or collaborator of requested house
    if (
      requestedHouse.owner._id != req.userData.id &&
      requestedHouse.collaborators.filter(
        (element) => element._id == req.userData.id
      ) == undefined
    ) {
      return res.status(403).json({
        message:
          'You are not an owner nor the collaborator of the requested house'
      });
    }

    res.status(200).json(requestedHouse);
  } catch (error) {
    next(error);
  }
};

exports.editHouse = async function (req, res, next) {
  try {
    const houseId = req.params.id;

    let house = await House.findOne({ _id: houseId });
    if (house == null) {
      res.status(404).json({ message: 'The requested house does not exist' });
    }

    if (house.owner != req.userData.id) {
      return res
        .status(403)
        .json({ message: 'You are not an owner of the requested house' });
    }

    house.name = req.body.name;
    house.description = req.body.description;
    await house.save();

    res.status(200).json({ message: 'House info updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteHouse = async function (req, res, next) {
  try {
    const houseId = req.params.id;
    // get house
    let house = await House.findOne({ _id: houseId });
    if (house == null) {
      return res.status(200).json({ message: 'House deleted.' });
    }

    if (req.userData.id != house.owner) {
      return res
        .status(403)
        .json({ message: 'You are not the owner owner of this house.' });
    }

    await house.delete();

    res.status(200).json({ message: 'House deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.deleteCollaborator = async function (req, res, next) {
  try {
    const houseId = req.params.id;
    const collaboratorId = req.body.id;
    let house = await House.findById(houseId);
    if (house == null) {
      return res
        .status(404)
        .json({ message: 'House with such id does not exist.' });
    }

    if (house.owner != req.userData.id) {
      res.status(403).json({ message: 'You are not the owner of this house.' });
    }

    house.collaborators = house.collaborators.filter(
      (element) => element != collaboratorId
    );
    await house.save();

    return res.status(200).json({ message: 'Collaborator deleted.' });
  } catch (error) {
    next(error);
  }
};
