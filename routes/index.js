var express = require('express');
var router = express.Router();
const path = require('path');
/* GET home page. */
router.get('/',function(req, res, next) {
  const htmlFilePath = path.join(__dirname, '../public/html', 'index.html');
  res.sendFile(htmlFilePath);
});



module.exports = router;
