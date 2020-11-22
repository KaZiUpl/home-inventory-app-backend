const { validationResult } = require('express-validator');
const formidable = require('formidable');

const ItemsService = require('../services/items.service');
const {
  UnprocessableEntityError,
  BadRequestError
} = require('../error/errors');

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

exports.uploadItemImage = async function (req, res, next) {
  try {
    await ItemsService.checkItemAccess(req.userData.id, req.params.id);

    const form = formidable();

    const file = await new Promise((resolve, reject) => {
      form.parse(req, function (err, fields, files) {
        if (err) {
          reject(err);
          return;
        }
        if (Object.values(files).length > 1) {
          reject(new BadRequestError('Submit only one file'));
          return;
        }
        if (!files.image) {
          reject(new UnprocessableEntityError('Image is missing'));
          return;
        }
        resolve(files.image);
      });
    }).catch((err) => {
      throw err;
    });

    await ItemsService.uploadItemImage(req.params.id, file);

    res.status(200).json({ message: 'Item image added.' });
  } catch (error) {
    next(error);
  }
};
