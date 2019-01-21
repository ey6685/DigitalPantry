const express = require('express');
const router = express.Router();

router.get('/ingredient', (req,res) => res.send('INGREDIENTS'));

module.exports = router;