let express = require('express');
let router = express.Router();

let testController = require('../controllers/test.controller');

router.get('/', testController.index);

module.exports = router;
