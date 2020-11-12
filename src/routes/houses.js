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
 * {
 *      "message": "House created."
 *      "id": "5f576dedb9d20a30e02e81e6"
 * }
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
 * {
 *  "message": "Room created.",
 * "id": "5f576dedb9d20a30e02e81e6"
 *}
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
 * {
 *      "message": "Collaborator added."
 * }
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
 * @apiParam {String} id house id
 * @apiSuccess (Success 200) {Object[]} users Array of collaborators
 * @apiSuccess (Success 200) {String} _id Collaborator's id
 * @apiSuccess (Success 200) {String} login Collaborator's login
 * @apiSuccessExample {json} Response(example):
 *[
 *   {
 *       "_id": "5f327188295d5f121464d782",
 *       "login": "kacperkaz"
 *   }
 *]
 */
router.get('/:id/collaborators', housesController.getCollaborators);

/**
 * @api {get} /houses/:id/rooms Get the list of rooms
 * @apiName GetRoomsList
 * @apiGroup House
 * @apiPermission House owner or collaborator
 * @apiParam {String} id house id
 * @apiSuccess (Success 200) {Object[]} rooms Array of house rooms
 * @apiSuccess (Success 200) {String} _id Room id
 * @apiSuccess (Success 200) {String} name Room name
 * @apiSuccess (Success 200) {String} description Room description
 * @apiSuccess (Success 200) {String} house House id
 * @apiSuccessExample {json} Response(example):
 * [
 * {
 *   "_id": "5f5775f5e8b1493d3c82ebca",
 *   "name": "room1",
 *   "description": "description",
 *   "house": "5f576dedb9d20a30e02e81e6",
 *   "__v": 0
 * }
 *]
 */
router.get('/:id/rooms', housesController.getRooms);

/**
 * @api {get} /houses Get the list of houses
 * @apiName GetHouseList
 * @apiGroup House
 * @apiPermission logged in user
 * @apiDescription Returns a list of houses that user owns or is collaborating in.
 * @apiSuccess (Success 200) {Object[]} houses Array of user's houses
 * @apiSuccess (Success 200) {String[]} collaborators Array of collaborator's id's
 * @apiSuccess (Success 200) {String} _id House id
 * @apiSuccess (Success 200) {String} name Name of the house
 * @apiSuccess (Success 200) {String} description Description of the house
 * @apiSuccess (Success 200) {Object} owner Object with owner's id and login
 * @apiSuccessExample {json} Success-Response:
 *[
 *  {
 *      "collaborators": [
 *          "5f327188295d5f121464d782"
 *     ],
 *     "_id": "5f438a3f1b69ff37807e2a0c",
 *    "name": "asd",
 *    "description": "some description",
 *    "owner": {
 *        "_id": "5f2584b9bb2de6e74fd3b39e",
 *        "login": "admin"
 *    },
 *   "__v": 3
 *}
 *]
 */
router.get('/', housesController.getHouseList);

/**
 * @api {get} /houses/:id Get house info
 * @apiName GetHouseInfo
 * @apiGroup House
 * @apiPermission house owner or collaborators
 * @apiParam {String} id ID of the house
 * @apiSuccess (Success 200) {Object} Requested house
 * @apiSuccess (Success 200) {Object[]} collaborators Array of collaborators' logins and ids
 * @apiSuccess (Success 200) {String} _id house's id
 * @apiSuccess (Success 200) {String} name Name of the house
 * @apiSuccess (Success 200) {String} description Description of the house
 * @apiSuccess (Success 200) {Object} owner Object with owner's id and login
 * @apiSuccessExample {json} Success-Response:
 *{
 *  "collaborators": [
 *      {
 *          "_id": "5f327188295d5f121464d782",
 *          "login": "kacperkaz"
 *      }
 *  ],
 *  "_id": "5f438a3f1b69ff37807e2a0c",
 *  "name": "asd",
 *  "description": "some description",
 *  "owner": {
 *      "_id": "5f2584b9bb2de6e74fd3b39e",
 *        "login": "admin"
 *   },
 *   "__v": 3
 *}
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
 *     {
 *       "message": "House info updated."
 *     }
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
 * {
 *      "message": "Collaborator deleted."
 * }
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
 *     {
 *       "message": "House deleted."
 *     }
 */
router.delete('/:id', housesController.deleteHouse);

module.exports = router;
