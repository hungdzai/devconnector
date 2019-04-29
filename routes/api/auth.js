const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');


// @route   GET api/profile
// desc     Test route
// @access  Public
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;