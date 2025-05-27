const express = require('express')
const { authenticateJWT } = require('../middlewares/authMiddleware')

const router = express.Router()

module.exports = router