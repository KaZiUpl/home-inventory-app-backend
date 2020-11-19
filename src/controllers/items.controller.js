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
    await ItemsService.checkItemAccess(req.userData.id, req.params.id);

    const requestedItem = await ItemsService.getItem(req.params.id);

    res.status(200).json(requestedItem);
  } catch (error) {
    next(error);
  }
};

exports.getItems = async function (req, res, next) {
  try {
    let items = await ItemsService.getItems(req.userData.id);

    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

exports.putItem = async function (req, res, next) {
  if (!validationResult(req).isEmpty()) {
    next(new UnprocessableEntityError());
  }
  try {
    await ItemsService.checkItemAccess(req.userData.id, req.params.id);

    await ItemsService.putItem(req.params.id, req.body);

    res.status(200).json({ message: 'Item updated!' });
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async function (req, res, next) {
  try {
    await ItemsService.checkItemAccess(req.userData.id, req.params.id);

    await ItemsService.deleteItem(req.params.id);

    res.status(200).json({ message: 'Item deleted.' });
  } catch (error) {
    next(error);
  }
};
