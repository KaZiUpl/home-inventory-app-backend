const ItemsService = require('../services/items.service');

exports.test = async function (req, res, next) {
  try {
    let item = await ItemsService.test();

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};
