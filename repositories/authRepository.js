const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Permission = require('../models/permissionModel');

exports.findUserByEmail = (email) => {
    return User.findOne({ email }).populate('role');
};

exports.createUser = (username, email, password, roleIds) => {
    const newUser = new User({
        username,
        email,
        password,
        role: roleIds
    });
    return newUser.save();
};

exports.findRolesByName = (name) => {
    return Role.find({ name: { $in: name } });
};

exports.findUserById = (userId) => {
    return User.findById(userId).populate({
        path: 'role',
        populate: {
            path: 'permissions',
            model: 'Permission',
        }
    });
};
exports.assignPermissionToRole = async (roleName, permissions) => {
    const role = await Role.findOne({ name: roleName });
    if (!role) {
        throw new Error(`Role ${roleName} không tồn tại`);
    }

    const permissionDocs = await Permission.find({ url: { $in: permissions.urls }, method: { $in: permissions.methods } });

    role.permissions = permissionDocs.map(permission => permission._id);
    await role.save();
    return role;
};