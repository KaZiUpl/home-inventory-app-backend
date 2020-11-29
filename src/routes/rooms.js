const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const roomsController = require('../controllers/rooms.controller');

//restrict all routes to logged in users
router.use(checkAuthMiddleware);

/**
 * @apiDefine Room Room
 * Controller for managing rooms within houses. Each room has it's own items. Item can be added, modified and deleted within the room. A room can be created, modified or deleted by the house owner.
 */

/**
 * @api {delete} /rooms/:roomId/storage Add item to room's storage
 * @apiName DostStorageItem
 * @apiGroup Room
 * @apiPermission house owner or collaborator
 * @apiParam {String} roomId Room id
 * @apiParam {String} item Item id
 * @apiParam {Number} quantity Quantity of item (optional, default=1, min. value = 1)
 * @apiParam {Date} expiration Expiration date (optional)
 * @apiParam {String} description Storage item description (optional)
 * @apiSuccess (Success 201) {String} message message
 * @apiSuccess (Success 201) {String} id created storage item id
 * @apiSuccessExample {json} Response(example):
 * {
 *   "message": "Storage item added to the room.",
 *   "id": "5fc3f6d386d62d154079952a"
 * }
 */
router.post(
  '/:id/storage',
  [body('item').exists(), body('quantity').exists()],
  roomsController.addStorageItem
);

/**
 * @api {get} /rooms/:roomId/storage Get room's storage
 * @apiName GetRoomStorage
 * @apiGroup Room
 * @apiPermission house owner or collaborator
 * @apiParam {String} id Room id
 * @apiSuccess (Success 200) {Object[]} storage items Array of room's storage items
 * @apiSuccess (Success 200) {String} _id Storage item id
 * @apiSuccess (Success 200) {Object} item Item data
 * @apiSuccess (Success 200) {Number} quantity Quantity of item
 * @apiSuccess (Success 200) {String} expiration Storage item expiration date
 * @apiSuccess (Success 200) {String} description Storage item description
 * @apiSuccessExample {json} Response(example):
 * [
 *        {
 *      "_id": "5fc3f6d386d62d154079952a",
 *      "item": {
 *          "_id": "5fc3f66286d62d1540799523",
 *         "name": "name",
 *          "description": "asd",
 *          "owner": "5fbe83acf4a9ae3450523667"
 *      },
 *     "quantity": 2
 *  },
 *   {
 *       "_id": "5fc3f86bd0aedb1aecf9fc86",
 *       "item": {
 *           "_id": "5fc3f66286d62d1540799523",
 *           "name": "name",
 *           "description": "asd",
 *           "owner": "5fbe83acf4a9ae3450523667"
 *       },
 *       "quantity": 2,
 *       "expiration": "2020-01-19T14:17:58.580Z",
 *       "description": "storage item description"
 *   }
 * ]
 */
router.get('/:id/storage', roomsController.getRoomStorage);

/**
 * @api {get} /rooms/:roomId/storage/:itemId Get storage item info
 * @apiName GetStorageItem
 * @apiGroup Room
 * @apiPermission house owner or collaborator
 * @apiParam {String} roomId Room id
 * @apiParam {String} storageId Storage item id
 * @apiSuccess (Success 200) {String} _id Storage item id
 * @apiSuccess (Success 200) {Object} item Item data
 * @apiSuccess (Success 200) {Number} quantity Quantity of item
 * @apiSuccess (Success 200) {String} expiration Storage item expiration date
 * @apiSuccess (Success 200) {String} description Storage item description
 * @apiSuccessExample {json} Response(example):
 *    {
 *   "_id": "5fc3f86bd0aedb1aecf9fc86",
 *   "item": {
 *       "_id": "5fc3f66286d62d1540799523",
 *       "name": "name",
 *       "description": "asd",
 *       "owner": "5fbe83acf4a9ae3450523667"
 *   },
 *   "quantity": 2,
 *   "expiration": "1970-01-19T14:17:58.580Z",
 *   "description": "storage item description"
 * }
 */
router.get('/:roomId/storage/:storageId', roomsController.getStorageItem);

/**
 * @api {get} /rooms/:id Get room info
 * @apiName GetRoom
 * @apiGroup Room
 * @apiPermission house owner
 * @apiParam {String} id Room id
 */
router.get('/:id', roomsController.getRoom);

/**
 * @api {put} /rooms/:roomId/storage/:itemId Update storage item info
 * @apiName DutStorageItem
 * @apiGroup Room
 * @apiPermission house owner or collaborator
 * @apiParam {String} roomId Room id
 * @apiParam {String} storageId Storage item id
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 * {
 *  "message": "Storage item updated successfully!"
 *}
 */
router.put(
  '/:roomId/storage/:storageId',
  [body('quantity').exists()],
  roomsController.updateStorageItem
);

/**
 * @api {put} /rooms/:id Modify a room
 * @apiName PutRoom
 * @apiGroup Room
 * @apiDescription Modifies room's name and description
 * @apiPermission house owner
 * @apiParam {String} id Room id
 * @apiParam {String} name Room's name
 * @apiParam {String} description Room's description
 */
router.put(
  '/:id',
  [body('name').exists(), body('description').exists()],
  roomsController.modifyRoom
);

/**
 * @api {delete} /rooms/:roomId/storage/:itemId Delete an item from a room's storage
 * @apiName DeleteStorageItem
 * @apiGroup Room
 * @apiPermission house owner or collaborator
 * @apiParam {String} roomId Room id
 * @apiParam {String} storageId Storage item id
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
 * {
 *   "message": "Storage item deleted successfully!"
 *}
 */
router.delete('/:roomId/storage/:storageId', roomsController.deleteStorageItem);

/**
 * @api {delete} /rooms/:id Delete a room
 * @apiName DeleteRoom
 * @apiGroup Room
 * @apiDescription Deletes a room with provided id
 * @apiPermission house owner
 * @apiParam {String} id Room id
 */
router.delete('/:id', roomsController.deleteRoom);

module.exports = router;
