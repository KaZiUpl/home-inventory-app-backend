const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

const Item = require('../models/item.model');
const User = require('../models/user.model');
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError
} = require('../error/errors');

exports.createItem = async function (userId, itemBody) {
  try {
    const user = await User.findById(userId);
    if (user == undefined) {
      throw new NotFoundError('User not found');
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

exports.getItems = async function (
  userId,
  eanCode = undefined,
  name = undefined
) {
  try {
    if (userId == null) {
      throw new BadRequestError('User id cannot be null');
    }

    let items = Item.find({
      $or: [{ owner: mongoose.Types.ObjectId(userId) }, { owner: null }]
    });
    if (eanCode) {
      items = items.where('ean').regex(new RegExp(eanCode));
    }
    if (name) {
      items = items.where('name').regex(new RegExp(name));
    }

    items = await items.exec();

    return items;
  } catch (error) {
    throw error;
  }
};

exports.putItem = async function (itemId, itemBody) {
  try {
    let item = await Item.findById(itemId);
    if (item == undefined) {
      throw new NotFoundError('Item not found');
    }
    if (itemBody.name == null) {
      throw new BadRequestError('Item name cannot be null');
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
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new BadRequestError('Invalid item id');
    }
    let item = await Item.findById(itemId);
    if (item == undefined) {
      throw new NotFoundError('Item not found');
    }
    await item.delete();
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

exports.uploadItemImage = async function (itemId, file) {
  try {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      throw new BadRequestError('Wrong file type. User png or jpg');
    }
    let item = await Item.findById(itemId);

    const dir = path.resolve(__dirname, `../../public/img/${item.owner}`);
    const rawData = await fs.readFile(file.path);
    const fileExtension = file.type.split('/')[1];
    const filename = `${itemId}.${fileExtension}`;

    //write file
    await fs.writeFile(`${dir}${path.sep}${filename}`, rawData);
    if (item.photo) {
      let oldImagePath = `${dir}${path.sep}${
        item.photo.split('/')[item.photo.split('/').length - 1]
      }`;
      await fs.unlink(oldImagePath);
    }
    //update item
    item.photo = `localhost:3000/img/${item.owner}/${item._id}.${fileExtension}`;
    await item.save();
  } catch (error) {
    throw error;
  }
};
