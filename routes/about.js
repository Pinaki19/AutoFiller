var express = require('express');
var router = express.Router();
const path = require('path');
/* GET home page. */
router.get('/contact', function (req, res, next) {
    const htmlFilePath = path.join(__dirname, '../public/html', 'about.html');
    res.sendFile(htmlFilePath);
});



module.exports = router;
