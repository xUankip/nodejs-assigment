var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const {authenticateToken, checkPermission} = require('../middleware/authMiddleware');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/login', function(req, res, next) {
  res.render('login.ejs');
})
router.post('/login', authController.login);


router.get('/', authenticateToken, checkPermission, (req, res ) => {
  res.send( req.user ?'Logged in' : 'Logged out');
})
module.exports = router;
