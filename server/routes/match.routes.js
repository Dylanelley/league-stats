let express = require('express');
let router = express.Router();

let matchController = require('../controllers/match.controller');

router.post('/', matchController.index);

module.exports = router;
