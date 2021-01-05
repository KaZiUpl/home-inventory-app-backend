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
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccess (Success 200) {String} id Created item's id
 * @apiSuccessExample {json} Response(example):
{
    "message": "Item created",
    "id": "5ff32565ab575e1cf4120159"
}
 */
router.post('/', [body('name').exists()], ItemsController.createItem);

/**
 * @api {get} /items/:id Get item info
 * @apiName GetItem
 * @apiGroup Item
 * @apiPermission item's owner or logged in user
 * @apiParam {String} id item's id
 * @apiSuccess (Success 200) {String} _id item's id
 * @apiSuccess (Success 200) {String} name item's name
 * @apiSuccess (Success 200) {String} description item's description
 * @apiSuccess (Success 200) {String} manufacturer item's manufacturer
 * @apiSuccess (Success 200) {Object} owner item's owner
 * @apiSuccess (Success 200) {String} owner._id item owner's id
 * @apiSuccess (Success 200) {String} owner.login item owner's login
 * @apiSuccessExample {json} Response(example):
{
    "_id": "5ff32565ab575e1cf4120159",
    "name": "Test item",
    "description": "Test item description",
    "manufacturer": "Test manufacturer",
    "owner": {
        "_id": "5ff3217ced3a2e44d4970bb6",
        "login": "Test2"
    },
    "__v": 0
}
 */
router.get('/:id', ItemsController.getItem);

/**
 * @api {get} /items/ Get item list
 * @apiDescription Returns array of user's items and global items.
 * @apiName GetItems
 * @apiGroup Item
 * @apiPermission logged in user
 * @apiSuccess (Success 200) {String} _id item's id
 * @apiSuccess (Success 200) {String} name item's name
 * @apiSuccess (Success 200) {String} description item's description
 * @apiSuccess (Success 200) {String} manufacturer item's manufacturer
 * @apiSuccess (Success 200) {String} owner item's owner id (field does not exist on global items)
 * @apiSuccessExample {json} Response(example):
[
    {
        "_id": "5fea3f4411a2ed3c28356ae2",
        "name": "Global item name",
        "description": "global item description",
        "__v": 0
    },
    {
        "_id": "5ff32565ab575e1cf4120159",
        "name": "Test item",
        "description": "Test item description",
        "manufacturer": "Test manufacturer",
        "owner": "5ff3217ced3a2e44d4970bb6",
        "__v": 0
    }
]
 */
router.get('/', ItemsController.getItems);

/**
 * @api {put} /items/:id Update item info
 * @apiName PutItem
 * @apiGroup Item
 * @apiPermission item's owner
 * @apiParam {String} id item's id
 * @apiParam {String} name item's name
 * @apiParam {String} description item's description
 * @apiParam {String} manufacturer item's manufacturer
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
{
    "message": "Item updated"
}
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
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
{
    "message": "Item deleted"
}
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
