const express = require('express');
const router = express.Router();
router.route('/member/edit/:id')
    .all((req, res, next) => {
        res.locals.memberData = {
            name: 'Jason',
            id: 'A002',
            Age: 34
        };
        next();
    })
    .get((req, res) => {
        const obj = {
            baseUrl: req.baseUrl,
            url: req.url,
            data: res.locals.memberData
        };
        res.send('get edit:' + JSON.stringify(obj));
    })
    .post((req, res) => {
        res.send('post edit:' + JSON.stringify(res.locals.memberData));
    });
    
module.exports = router;