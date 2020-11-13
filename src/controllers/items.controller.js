const ItemsService = require('../services/items.service');

exports.createItem = async function (req, res, next) {
  try {
    await ItemsService.createItem();

    res.json();
  } catch (error) {
    next(error);
  }
};

exports.getItem = async function (req, res, next) {
  try {
    await ItemsService.getItem();

    res.json();
  } catch (error) {
    next(error);
  }
};

exports.getItems = async function (req, res, next) {
  try {
    await ItemsService.getItems();

    res.json();
  } catch (error) {
    next(error);
  }
};

exports.putItem = async function (req, res, next) {
  try {
    await ItemsService.putItem();

    res.json();
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async function (req, res, next) {
  try {
    await ItemsService.deleteItem();

    res.json();
  } catch (error) {
    next(error);
  }
};
