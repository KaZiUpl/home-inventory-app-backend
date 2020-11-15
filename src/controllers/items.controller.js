const { validationResult } = require('express-validator');

const ItemsService = require('../services/items.service');
const { UnprocessableEntityError } = require('../error/errors');

exports.createItem = async function (req, res, next) {
  if (!validationResult(req).isEmpty()) {
    next(new UnprocessableEntityError());
  }
  try {
    let itemId = await ItemsService.createItem(req.userData.id, req.body);

    res.status(201).json({ message: 'Item created.', id: itemId });
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
