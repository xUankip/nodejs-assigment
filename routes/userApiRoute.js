const express = require('express');
const router = express.Router();
const userAPI = require('../api/userAPI');

router.get('/', async  function (req, res) {
    await userAPI.getUser(req, res);
});
router.get('/:id', async  function (req, res) {
    await userAPI.getUserDetail(req, res);
})
router.post('/:id', async  function (req, res) {
    await userAPI.storeUser(req, res);
})
router.delete('/:id', async  function (req, res) {
    await userAPI.deleteUser(req, res);
})


module.exports = router;