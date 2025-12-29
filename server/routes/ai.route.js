const express = require('express');
const router = express.Router();
const { generateResponse } = require('../controllers/ai.controller');

router.post('/chat', generateResponse);

module.exports = router;