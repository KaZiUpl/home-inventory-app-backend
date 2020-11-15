const mongoose = require('mongoose');

const Item = require('../models/item.model');
const User = require('../models/user.model');

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
  } catch (error) {
    throw error;
  }
};

exports.getItems = async function () {
  try {
  } catch (error) {
    throw error;
  }
};

exports.putItem = async function (itemId, itemBody) {
  try {
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
