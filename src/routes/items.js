const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const ItemsController = require('../controllers/items.controller');

router.use(checkAuthMiddleware);

/**
 * @apiDefine Item Item
 * This controller controls user's items as well as publicly available items. Each user adds items to their database that can be added later as a storage items within rooms.
 */

/**
 * @api {post} /items Create new item
 * @apiName PostItem
 * @apiGroup Item
 * @apiPermission everyone
 * @apiParam {String} name item name
 * @apiParam {String} description item description
 * @apiParam {String} manufacturer item's manufacturer name
 * @apiParam {String} photo image data base64 encoded
 */
router.post('/', [body('name').exists()], ItemsController.createItem);

/**
 * @api {get} /items/:id Get item info
 * @apiName GetItem
 * @apiGroup Item
 * @apiPermission item's owner or logged in user
 * @apiParam {String} id item's id
 */
router.get('/:id', ItemsController.getItem);

/**
 * @api {get} /items/ Get item list
 * @apiName GetItems
 * @apiGroup Item
 * @apiPermission logged in user
 */
router.get('/', ItemsController.getItems);

/**
 * @api {put} /items/:id Update item info
 * @apiName PutItem
 * @apiGroup Item
 * @apiPermission item's owner
 * @apiParam {String} id item's id
 */
router.put(
  '/:id',
  [
    body('name').exists(),
    body('description').exists(),
    body('manufacturer').exists()
  ],
  ItemsController.putItem
);

/**
 * @api {delete} /items/:id Delete item
 * @apiName DeleteItem
 * @apiGroup Item
 * @apiPermission item's owner
 * @apiParam {String} id item's id
 */
router.delete('/:id', ItemsController.deleteItem);

/**
 * @api {post} /items/:id/photo Upload item's photo
 * @apiDescription Uploads a photo of the item. Request is required to be on Content-Type: multipart/form-data. Allowed file types are jpg and png.
 * @apiName PostItemImage
 * @apiGroup Item
 * @apiPermission item's owner
 * @apiParam {File} image item's image
 */
router.post('/:id/photo', ItemsController.uploadItemImage);

module.exports = router;
