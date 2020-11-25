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
 * @apiParam {String} itemId Item id
 * @apiParam {Number} quantity Quantity of item (optional, default=1)
 * @apiParam {Date} expiration Expiration date (optional)
 */
router.post(
  '/:id/storage',
  [body('item_id').exists(), body('quantity').exists()],
  roomsController.addStorageItem
);

/**
 * @api {get} /rooms/:roomId/storage Get room's item storage
 * @apiName GetRoomStorage
 * @apiGroup Room
 * @apiPermission house owner or collaborator
 * @apiParam {String} roomId Room id
 */
router.get('/:roomId/storage', roomsController.getRoomStorage);

/**
 * @api {get} /rooms/:roomId/storage/:itemId Get storage item info
 * @apiName GetStorageItem
 * @apiGroup Room
 * @apiPermission house owner or collaborator
 * @apiParam {String} roomId Room id
 * @apiParam {String} itemId Item id
 */
router.get('/:roomId/storage/:itemId', roomsController.getStorageItem);

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
 * @apiParam {String} itemId Item id
 */
router.put('/:roomId/storage/:itemId', roomsController.updateStorageItem);

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
 * @apiParam {String} itemId Item id
 */
router.delete('/:roomId/storage/:itemId', roomsController.deleteStorageItem);

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
