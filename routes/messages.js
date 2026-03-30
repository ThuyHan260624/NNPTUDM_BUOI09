var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messages');
var authHandler = require('../utils/authHandler.js.js'); // file utils là authHandler.js.js
var uploadHandler = require('../utils/uploadHandler.js');

router.get('/', authHandler.checkLogin, messageController.getLastMessages);
router.get('/:userID', authHandler.checkLogin, messageController.getMessagesWithUser);
router.post('/', authHandler.checkLogin, uploadHandler.uploadAny.single('file'), messageController.sendMessage);

module.exports = router;
