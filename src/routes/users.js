const express = require('express');
const userController = require('../controllers/users');
const router = express.Router();

/**
 * @api {get} /users Hello world route
 * @apiName HelloWorld
 * @apiGroup User
 * @apiSuccess (Success 200) {String} msg Hello world message
 * @apiSuccessExample {json} Response(example):
 *     {
 *       "msg": "Hello World!"
 *     }
 */
router.get('/', userController.test);

module.exports = router;
