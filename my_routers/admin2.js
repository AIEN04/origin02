const express = require('express');

const router = express.Router();

router.get('/admin2/:p1?/:p2?', (req, res)=>{
    res.send('admin2: ' + JSON.stringify(req.params));
});

module.exports = router;