const express = require('express');
const router = express.Router();

router.get('/',(req, res)=> {
    var io = req.app.get(io);
})

module.exports = router;