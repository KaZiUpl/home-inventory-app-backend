const mongoose = require('mongoose');

const Item = require('../models/item.model');
const User = require('../models/user.model');
const { NotFoundError, ForbiddenError } = require('../error/errors');

exports.createItem = async function (userId, itemBody) {
  try {
    const user = await User.findById(userId);
    if (user == undefined) {
      throw new Error('User not found.');
    }
    const newItemBody = { ...itemBody, owner: user._id };

    const item = await Item.create(newItemBody);

    return item._id;
  } catch (error) {
    throw error;
  }
};

exports.getItem = async function (itemId) {
  try {
    const item = await Item.findById(itemId);
    if (item == undefined) {
      throw new NotFoundError('No such item');
    }

    return item;
  } catch (error) {
    throw error;
  }
};

exports.getItems = async function (userId) {
  try {
    if (userId == null) {
      throw new Error();
    }
    let items = await Item.find({ $or: [{ owner: userId }, { owner: null }] });

    return items;
  } catch (error) {
    throw error;
  }
};

exports.putItem = async function (itemId, itemBody) {
  try {
    let item = await Item.findById(itemId);
    if (item == undefined) {
      throw new Error();
    }
    if (itemBody.name == null) {
      throw new Error();
    }
    //exclude owner and photo from itemBody
    let { owner, photo, ...newItemBody } = itemBody;

    await Item.updateOne({ _id: itemId }, { $set: newItemBody });
  } catch (error) {
    throw error;
  }
};

exports.deleteItem = async function (itemId) {
  try {
  } catch (error) {
    throw error;
  }
};

exports.checkItemAccess = async function (userId, itemId) {
  try {
    let item = await Item.findById(itemId);
    if (item == undefined) {
      throw new NotFoundError('Item not found');
    }

    if (item.owner && !item.owner.equals(userId)) {
      throw new ForbiddenError();
    }
  } catch (error) {
    throw error;
  }
};
