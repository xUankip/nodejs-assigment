const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Permission = require('../models/permissionModel');
const userService = require("../repositories/authRepository");

exports.getUser = async (req, res) => {
    try{
        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit)||3;

        const startIndex = (page-1)*limit;
        const total = await User.countDocuments()
        const users = await userService.getUsers(startIndex, limit);
        res.json({
            page,
            limit,
            total,
            pages: Math.ceil(total/limit),
            data: users,
        })
    } catch (err){
        res.status(400).send('Error getting user');
    }
}
exports.getUserDetail = async (req, res) => {
    try {
        const user = await userService.findById(req.params.id)
        res.json({
            data: user,
        })
    } catch (err){
        res.status(400).send('Error getting user');
    }
}
exports.storeUser = async (req, res) => {
    const {username, email, password, roleIds} = req.body;
    try{
        const user = await userService.createUser({username, email, password, roleIds});
        res.json({
            data: user,
        })
    }catch (err){
        res.status(400).send('Error creating user');
    }
}
exports.deleteUser = async (req, res) => {
    try{
        await userService.HardDeleteUser(req.params.id)
        res.json({
            message: 'User deleted successfully'
        })
    } catch (err){
        res.status(400).send('Error deleteing user');
    }
}