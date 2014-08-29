var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { menu: menu, title: 'Express' });
  res.redirect('tareas');
});

module.exports = router;
