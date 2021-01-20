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
 * @api {post} /rooms/:roomId/storage Add item to room's storage
 * @apiName DostStorageItem
 * @apiGroup Room
 * @apiPermission house owner or collaborator
 * @apiParam {String} roomId Room id
 * @apiParam {String} item Item id
 * @apiParam {Number} quantity Quantity of item (optional, default=1, min. value = 1)
 * @apiParam {Number} expiration Expiration date timestamp (optional)
 * @apiParam {String} description Storage item description (optional)
 * @apiSuccess (Success 201) {String} message message
 * @apiSuccess (Success 201) {String} id created storage item id
 * @apiSuccessExample {json} Response(example):
{
    "message": "Storage item added to the room",
    "id": "5ff327ecc0136323bcbc01fa"
}
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
 * @apiDescription Return an array of room's storage items
 * @apiParam {String} id Room id
 * @apiSuccess (Success 200) {String} _id Storage item id
 * @apiSuccess (Success 200) {Object} item Item reference
 * @apiSuccess (Success 200) {String} item._id Item id
 * @apiSuccess (Success 200) {String} item.name Item name
 * @apiSuccess (Success 200) {String} item.description Item description
 * @apiSuccess (Success 200) {String} item.ean Item ean code
 * @apiSuccess (Success 200) {String} item.manufacturer Item manufacturer
 * @apiSuccess (Success 200) {Object} item.owner Item owner reference
 * @apiSuccess (Success 200) {String} item.owner._id Item owner id
 * @apiSuccess (Success 200) {String} item.owner.login Item owner login
 * @apiSuccess (Success 200) {String} description Storage item description
 * @apiSuccess (Success 200) {Number} quantity Quantity of item
 * @apiSuccess (Success 200) {String} expiration Storage item expiration date

 * @apiSuccessExample {json} Response(example):
[
    {
        "_id": "5ff3283d81a1883a146c7c18",
        "item": {
            "_id": "5ff32565ab575e1cf4120159",
            "name": "Test item",
            "description": "Test item description",
            "manufacturer": "Test manufacturer",
            "owner": {
                "_id": "5ff3217ced3a2e44d4970bb6",
                "login": "Test2"
            },
            "__v": 0
        },
        "quantity": 1,
        "expiration": "2020-12-24T17:30:00.000Z",
        "description": "Storage item description"
    }
]
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
 * @apiSuccess (Success 200) {Object} item Item reference
 * @apiSuccess (Success 200) {String} item._id Item id
 * @apiSuccess (Success 200) {String} item.name Item name
 * @apiSuccess (Success 200) {String} item.description Item description
 * @apiSuccess (Success 200) {String} item.ean Item ean code
 * @apiSuccess (Success 200) {String} item.manufacturer Item manufacturer
 * @apiSuccess (Success 200) {String} item.photo Item photo path
 * @apiSuccess (Success 200) {Objest} item.owner Item owner
 * @apiSuccess (Success 200) {String} item.owner._id Item owner id
 * @apiSuccess (Success 200) {String} item.owner.login Item owner login
 * @apiSuccess (Success 200) {Number} quantity Quantity of item
 * @apiSuccess (Success 200) {String} expiration Storage item expiration date
 * @apiSuccess (Success 200) {String} description Storage item description
 * @apiSuccessExample {json} Response(example):
{
    "_id": "600825c81c89735084e33264",
    "item": {
        "_id": "600824adf1c47c1e80d941a3",
        "name": "Test item",
        "description": "Test item description",
        "manufacturer": "Test item manufdacturer",
        "owner": {
            "_id": "600823fb9afa7825281009da",
            "login": "Testuser"
        },
        "__v": 0,
        "photo": "/img/600823fb9afa7825281009da/600824adf1c47c1e80d941a3.jpeg",
        "ean": "12345678901011"
    },
    "quantity": 3,
    "expiration": "1970-01-01T00:02:03.456Z",
    "description": "Storage item description"
}
 */
router.get('/:roomId/storage/:storageId', roomsController.getStorageItem);

/**
 * @api {get} /rooms/:id Get room info
 * @apiName GetRoom
 * @apiDescription Returns an object containing information about a room and limited info about a house
 * @apiGroup Room
 * @apiPermission house owner
 * @apiParam {String} id Room id
 * @apiSuccess (Success 200) {String} _id Room id
 * @apiSuccess (Success 200) {String} name Room name
 * @apiSuccess (Success 200) {String} description Room description
 * @apiSuccess (Success 200) {Object[]} storage Room's storage items
 * @apiSuccess (Success 200) {Object} house House info
 * @apiSuccessExample {json} Response(example):
 * {
    "_id": "5fc3f6a786d62d1540799526",
    "storage": [
        {
            "_id": "5fc3f6bc86d62d1540799527",
            "item": "5fc3f66286d62d1540799523",
            "quantity": 2
        },
        {
            "_id": "5fc3f6d186d62d1540799528",
            "item": "5fc3f66286d62d1540799523",
            "quantity": 2
        },
        {
            "_id": "5fc3f6d286d62d1540799529",
            "item": "5fc3f66286d62d1540799523",
            "quantity": 2
        },
        {
            "_id": "5fc3f6d386d62d154079952a",
            "item": "5fc3f66286d62d1540799523",
            "quantity": 2
        }
    ],
    "name": "new name 3",
    "house": {
        "_id": "5fc3f6a086d62d1540799525",
        "name": "house"
    },
    "description": "room description"
}
 */
router.get('/:id', roomsController.getRoom);

/**
 * @api {put} /rooms/:roomId/storage/:itemId Update storage item info
 * @apiName DutStorageItem
 * @apiGroup Room
 * @apiPermission house owner or collaborator
 * @apiParam {String} roomId Room id
 * @apiParam {String} storageId Storage item id
 * @apiParam (Request) {Number} quantity new storage item quantity
 * @apiParam (Request) {Number} expiration new storage item expiration (timestamp in ms)
 * @apiParam (Request) {String} description new storage item description
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
{
    "message": "Storage item updated successfully"
}
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
 * @apiSuccessExample {json} Response(example):
{
    "message": "Room modified"
}
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
{
    "message": "Storage item deleted successfully"
}
 */
router.delete('/:roomId/storage/:storageId', roomsController.deleteStorageItem);

/**
 * @api {delete} /rooms/:id Delete a room
 * @apiName DeleteRoom
 * @apiGroup Room
 * @apiDescription Deletes a room with provided id
 * @apiPermission house owner
 * @apiParam {String} id Room id
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
{
    "message": "Room deleted"
}
 */
router.delete('/:id', roomsController.deleteRoom);

module.exports = router;
