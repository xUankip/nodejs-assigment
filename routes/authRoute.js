const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, checkPermission } = require('../middleware/authMiddleware');

router.get('/login', (req, res) => {
    res.render('auth/login.ejs');
});

router.get('/register', (req, res) => {
    res.render('auth/register.ejs');
});

router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/admin', authenticateToken, checkPermission, (req, res) => {
    res.send(req.user ? 'Logged in with admin access' : 'Logged out');
});
router.get('/user/create', authenticateToken, checkPermission, (req, res) => {
    res.send(req.user ? 'success in with admin access' : 'Logged out');
});
module.exports = router;
