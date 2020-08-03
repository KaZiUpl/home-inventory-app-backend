const express = require('express');
const userController = require('../controllers/users');
const router = express.Router();

/**
 * @api {post} /users Create new user
 * @apiName PostCreateUser
 * @apiGroup User
 * @apiParam {String} login Username
 * @apiParam {String} password User password
 * @apiParam {String} email User email
 * @apiSuccess (Success 200) {String} msg Response message
 * @apiSuccessExample {json} Response(example):
 *     {
 *       "msg": "User created."
 *     }
 */
router.post('/', userController.createNewUser);

/**
 * @api {get} /users/:id Get user info
 * @apiName GetUserInfo
 * @apiGroup User
 * @apiSuccess (Success 200) {String} login User login
 * @apiSuccess (Success 200) {String} email User email
 * @apiSuccessExample {json} Response(example):
 *     {
 *       "login": "john_doe",
 *       "email": "john@doe.com"
 *     }
 */
router.get('/:id', userController.getUser);

/**
 * @api {put} /users/:id Update user info
 * @apiName PutUserInfo
 * @apiGroup User
 */
router.put('/:id', userController.modifyUser);

/**
 * @api {post} /users/auth Login user
 * @apiName PostLogin
 * @apiGroup User
 * @apiParam {String} login Username
 * @apiParam {String} password User password
 * @apiSuccess (Success 200) {String} token Access token
 * @apiSuccess (Success 200) {String} refresh_token Refresh token
 * @apiSuccessExample {json} Response(example):
 *     {
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
 *       "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
 *     }
 */
router.post('/auth', userController.login);

/**
 * @api {post} /users/auth/refresh Refresh access token
 * @apiName PostRefreshToken
 * @apiGroup User
 */
router.post('/auth/refresh', userController.refreshToken);

/**
 * @api {post} /users/logout Logout user
 * @apiName PostLogout
 * @apiGroup User
 */
router.post('/logout', userController.logout);

module.exports = router;
