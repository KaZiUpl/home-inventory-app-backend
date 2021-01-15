const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const housesController = require('../controllers/houses.controller');
const roomsController = require('../controllers/rooms.controller');

router.use(checkAuthMiddleware);

/**
 * @apiDefine House House
 * Endpoints for managing information about user's houses called houses. Every house has one owner that can change house info and add other users as collaborators.
 */

/**
 * @api {post} /houses Create new house
 * @apiName PostHouse
 * @apiGroup House
 * @apiPermission logged in user
 * @apiParam {String} name Name of the house
 * @apiParam {String} description Description of the house
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccess (Success 200) {String} id id of created house
 * @apiSuccessExample {json} Response(example):
{
    "message": "House created",
    "id": "5ff323d07e31d80928d4a5a4"
}
 */
router.post('/', [body('name').exists()], housesController.createHouse);

/**
 * @api {post} /houses/:id/rooms Create a room
 * @apiName PostRoom
 * @apiGroup House
 * @apiDescription Creates a room in a house with provided id
 * @apiPermission house owner
 * @apiParam {String} id House id
 * @apiParam {String} name Room's name
 * @apiParam {String} description Room's description
 * @apiSuccess (Success 200) {String} message message
 * @apiSuccess (Success 200) {String} id id of created room
 * @apiSuccessExample {json} Response(example):
{
    "message": "Room created",
    "id": "5ff324fae7613431908d3e27"
}
 */
router.post('/:id/rooms', [body('name').exists()], housesController.createRoom);

/**
 * @api {post} /houses/:id/collaborators Add a collaborator
 * @apiName PostAddCollaborator
 * @apiGroup House
 * @apiPermission house owner
 * @apiDescription Adds a user as a collaborator. First user with matching login or email is added.
 * @apiParam {String} id house id
 * @apiParam {String} name login or email of the collaborator
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
{
    "message": "Collaborator added"
}
 */
router.post(
  '/:id/collaborators',
  [body('name').exists()],
  housesController.addCollaborator
);

/**
 * @api {get} /houses/:id/collaborators Get the list of collaborators
 * @apiName GetCollaboratorList
 * @apiGroup House
 * @apiPermission House owner or collaborator
 * @apiDescription Returns an array of house collaborators.
 * @apiParam {String} id house id
 * @apiSuccess (Success 200) {String} _id Collaborator's id
 * @apiSuccess (Success 200) {String} login Collaborator's login
 * @apiSuccessExample {json} Response(example):
[
    {
        "_id": "5fd4a0ca340e8d405cd76507",
        "login": "KaZiUpl"
    }
]
 */
router.get('/:id/collaborators', housesController.getCollaborators);

/**
 * @api {get} /houses/:id/rooms Get the list of rooms
 * @apiName GetRoomsList
 * @apiGroup House
 * @apiPermission House owner or collaborator
 * @apiDescription Returns an array of house rooms.
 * @apiParam {String} id house id
 * @apiSuccess (Success 200) {String} _id Room id
 * @apiSuccess (Success 200) {String} name Room name
 * @apiSuccess (Success 200) {String} description Room description
 * @apiSuccess (Success 200) {String} house House id
 * @apiSuccess (Success 200) {Object[]} storage Array of room storage items
 * @apiSuccess (Success 200) {String} storage._id storage item id
 * @apiSuccess (Success 200) {String} storage.item item id
 * @apiSuccess (Success 200) {String} storage.quantity storage item quantity
 * @apiSuccess (Success 200) {String} storage.expiration storage item expiration date
 * @apiSuccess (Success 200) {String} storage.description storage item description
 * @apiSuccessExample {json} Response(example):
[
    {
        "_id": "5ff324fae7613431908d3e27",
        "storage": [
            {
                "_id": "5ff3283d81a1883a146c7c18",
                "item": "5ff32565ab575e1cf4120159",
                "quantity": 5,
                "expiration": "2020-12-24T17:30:00.000Z",
                "description": "storage item description"
            }
        ],
        "name": "Test room",
        "description": "test room description",
        "house": "5ff323d07e31d80928d4a5a4",
        "__v": 2
    },
    {
        "_id": "5ff3250eab575e1cf4120157",
        "storage": [],
        "name": "Test room 2",
        "description": "Test room 2 description",
        "house": "5ff323d07e31d80928d4a5a4",
        "__v": 0
    }
]
 */
router.get('/:id/rooms', housesController.getRooms);

/**
 * @api {get} /houses Get the list of houses
 * @apiName GetHouseList
 * @apiGroup House
 * @apiPermission logged in user
 * @apiDescription Return an array of houses that user owns and is a collaborator in.
 * @apiSuccess (Success 200) {String[]} collaborators Array of collaborator ids
 * @apiSuccess (Success 200) {String[]} rooms Array of room ids
 * @apiSuccess (Success 200) {String} _id House id
 * @apiSuccess (Success 200) {String} name Name of the house
 * @apiSuccess (Success 200) {String} description Description of the house
 * @apiSuccess (Success 200) {Object} owner house owner
 * @apiSuccess (Success 200) {String} owner._id house owner id
 * @apiSuccess (Success 200) {String} owner.login house owner login
 * @apiSuccessExample {json} Success-Response:
[
    {
        "collaborators": [
            "5fd4a0ca340e8d405cd76507"
        ],
        "rooms": [
            "5ff324fae7613431908d3e27",
            "5ff3250eab575e1cf4120157"
        ],
        "_id": "5ff323d07e31d80928d4a5a4",
        "name": "New test house name",
        "description": "New test house description",
        "owner": {
            "_id": "5ff3217ced3a2e44d4970bb6",
            "login": "Test2"
        },
        "__v": 3
    },
    {
        "collaborators": [],
        "rooms": [],
        "_id": "5ff32409f7670a19a4e08250",
        "name": "Test house 2",
        "description": "Test house 2 description",
        "owner": {
            "_id": "5ff3217ced3a2e44d4970bb6",
            "login": "Test2"
        },
        "__v": 0
    }
]
 */
router.get('/', housesController.getHouseList);

/**
 * @api {get} /houses/storage Get the list of all storage items accessible by user
 * @apiDescription Return array of storage items from all rooms of all houses accesible by a user
 * @apiName GetAllStorage
 * @apiGroup House
 * @apiPermission logged in user
 * @apiSuccess (Success 200) {String} _id Storage item id
 * @apiSuccess (Success 200) {String} description Storage item description
 * @apiSuccess (Success 200) {Number} quantity Storage item quantity
 * @apiSuccess (Success 200) {String} expiration Storage item expiration date
 * @apiSuccess (Success 200) {Object} item Item reference
 * @apiSuccess (Success 200) {String} item._id Item id
 * @apiSuccess (Success 200) {String} item.name Item name
 * @apiSuccess (Success 200) {String} item.ean Item barcode
 * @apiSuccess (Success 200) {Object} room Room reference
 * @apiSuccess (Success 200) {String} room._id Room id
 * @apiSuccess (Success 200) {String} room.name Room name
 * @apiSuccess (Success 200) {Object} house House reference
 * @apiSuccess (Success 200) {String} house._id House id
 * @apiSuccess (Success 200) {String} house.name House name
 * @apiSuccessExample {json} Success-Response:
[
    {
        "_id": "60020c7d3c95294a6ca4af23",
        "quantity": 1,
        "item": {
            "_id": "60020c7d3c95294a6ca4af1d",
            "name": "item1",
            "ean": "123",
            "__v": 0
        },
        "description": "desc",
        "expiration": "2021-01-15T21:49:01.636Z",
        "room": {
            "_id": "60020c7d3c95294a6ca4af21",
            "name": "room1"
        },
        "house": {
            "_id": "60020c7d3c95294a6ca4af1f",
            "name": "house1"
        }
    },
    {
        "_id": "60020c7d3c95294a6ca4af24",
        "quantity": 2,
        "item": {
            "_id": "60020c7d3c95294a6ca4af1e",
            "name": "item2",
            "ean": "123",
            "__v": 0
        },
        "description": "desc",
        "expiration": "2021-01-15T21:49:01.636Z",
        "room": {
            "_id": "60020c7d3c95294a6ca4af21",
            "name": "room1"
        },
        "house": {
            "_id": "60020c7d3c95294a6ca4af1f",
            "name": "house1"
        }
    }
]
 */
router.get('/storage', housesController.getStorage);

/**
 * @api {get} /houses/:id/storage Get the list of storage items from all house rooms
 * @apiName GetHouseStorage
 * @apiGroup House
 * @apiPermission house owner, house collaborator
 * @apiDescription Returns a list of storage items from all of the house rooms.
 * @apiSuccess (Success 200) {String} _id Storage item id
 * @apiSuccess (Success 200) {Number} quantity Storage item quantity
 * @apiSuccess (Success 200) {Date} expiration Storage item expiration date
 * @apiSuccess (Success 200) {String} description Storage item description
 * @apiSuccess (Success 200) {Object} item Item reference
 * @apiSuccess (Success 200) {String} item._id Item id
 * @apiSuccess (Success 200) {String} item.name Item name
 * @apiSuccess (Success 200) {String} item.description Item description
 * @apiSuccess (Success 200) {String} item.owner Item owner
 * @apiSuccess (Success 200) {Object} room Room reference
 * @apiSuccess (Success 200) {String} room._id Room id
 * @apiSuccess (Success 200) {String} room.name Room name
 * @apiSuccessExample {json} Success-Response:
 * [
 *  {
 *      "_id": "5fccb43bbf6d7110f05d78c8",
 *      "item": {
 *          "_id": "5fc3f66286d62d1540799523",
 *          "name": "name",
 *          "description": "asd",
 *          "owner": "5fbe83acf4a9ae3450523667",
 *          "__v": 0
 *      },
 *      "quantity": 2,
 *      "expiration": "1970-01-19T14:17:58.580Z",
 *      "description": "another description",
 *      "room": {
 *          "_id": "5fbe83e4f4a9ae345052366b",
 *          "name": "room1"
 *      }
 *  },
 *  {
 *      "_id": "5fccb45abf6d7110f05d78ca",
 *      "item": {
 *          "_id": "5fc3f4ba865c05280c628c34",
 *          "name": "name",
 *          "description": "asd",
 *          "owner": "5fbe83acf4a9ae3450523667",
 *          "__v": 0
 *      },
 *      "quantity": 2,
 *      "expiration": "1970-01-19T14:17:58.580Z",
 *      "description": "description",
 *      "room": {
 *          "_id": "5fbe83e4f4a9ae345052366b",
 *          "name": "room1"
 *      }
 *  }
 * ]
 */
router.get('/:id/storage', housesController.getHouseStorage);

/**
 * @api {get} /houses/:id Get house info
 * @apiName GetHouseInfo
 * @apiGroup House
 * @apiPermission house owner or collaborators
 * @apiDescription Return an object containing house information as well as array of rooms that belong to the requested house. Each room contains an array of it's storage items.
 * @apiParam {String} id ID of the house
 * @apiSuccess (Success 200) {Object[]} collaborators Array of house collaborators
 * @apiSuccess (Success 200) {String} collaborators._id Collaborator's id
 * @apiSuccess (Success 200) {String} collaborators.login Collaborator's login
 * @apiSuccess (Success 200) {Object[]} rooms Array of house rooms
 * @apiSuccess (Success 200) {String} rooms._id room's id
 * @apiSuccess (Success 200) {String} rooms.name room's name
 * @apiSuccess (Success 200) {String} rooms.description room's description'
 * @apiSuccess (Success 200) {String} rooms.house house id
 * @apiSuccess (Success 200) {Object[]} rooms.storage room storage
 * @apiSuccess (Success 200) {String} rooms.storage._id storage item id
 * @apiSuccess (Success 200) {Object} rooms.storage.item item reference
 * @apiSuccess (Success 200) {String} rooms.storage.item._id item's id
 * @apiSuccess (Success 200) {String} rooms.storage.item.name item's name
 * @apiSuccess (Success 200) {String} rooms.storage.quantity storage item's quantity
 * @apiSuccess (Success 200) {String} rooms.storage.description storage item's description
 * @apiSuccess (Success 200) {String} rooms.storage.expiration storage item's expiration date
 * @apiSuccess (Success 200) {String} _id house's id
 * @apiSuccess (Success 200) {String} name Name of the house
 * @apiSuccess (Success 200) {String} description Description of the house
 * @apiSuccess (Success 200) {Object} owner house owner reference
 * @apiSuccess (Success 200) {String} owner._id house owner id
 * @apiSuccess (Success 200) {String} owner.login house owner login
 * @apiSuccessExample {json} Success-Response:
{
    "collaborators": [
        {
            "_id": "5fd4a0ca340e8d405cd76507",
            "login": "KaZiUpl"
        }
    ],
    "rooms": [
        {
            "_id": "5ff324fae7613431908d3e27",
            "storage": [
                {
                    "_id": "5ff3283d81a1883a146c7c18",
                    "item": {
                        "_id": "5ff32565ab575e1cf4120159",
                        "name": "Test item"
                    },
                    "quantity": 5,
                    "expiration": "2020-12-24T17:30:00.000Z",
                    "description": "new storage item description"
                }
            ],
            "name": "new room name",
            "description": "new room description",
            "house": "5ff323d07e31d80928d4a5a4",
            "__v": 2
        }
    ],
    "_id": "5ff323d07e31d80928d4a5a4",
    "name": "New test house name",
    "description": "New test house description",
    "owner": {
        "_id": "5ff3217ced3a2e44d4970bb6",
        "login": "Test2"
    },
    "__v": 3
}
 */
router.get('/:id', housesController.getHouse);

/**
 * @api {put} /houses/:id Modify house info
 * @apiName PutHouseInfo
 * @apiGroup House
 * @apiPermission house owner
 * @apiParam {String} name New name of the house
 * @apiParam {String} description New description of the house
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample Success-Response:
{
    "message": "House info updated"
}
 */
router.put(
  '/:id',
  [body('name').exists(), body('description').exists()],
  housesController.editHouse
);

/**
 * @api {delete} /houses/:id/collaborators/:userId Remove a collaborator
 * @apiName DeleteCollaborator
 * @apiGroup House
 * @apiPermission house owner or collaborator
 * @apiDescription Removes user with provided id from collaborators list. Can be used either by house owner or one of its collaborators in order to remove oneself from collaborating.
 * @apiParam {String} id house id
 * @apiParam {String} id collaborator's id
 * @apiSuccess (Success 200) {String} message Response message
 * @apiSuccessExample {json} Response(example):
{
    "message": "Collaborator deleted"
}
 */
router.delete(
  '/:id/collaborators/:userId',
  housesController.deleteCollaborator
);

/**
 * @api {delete} /houses/:id Delete a house
 * @apiName DeleteHouse
 * @apiGroup House
 * @apiPermission house owner
 * @apiParam {String} id house id
 * @apiSuccess {String} message Response message
 * @apiSuccessExample {json} Success-Response:
{
    "message": "House deleted"
}
 */
router.delete('/:id', housesController.deleteHouse);

module.exports = router;
