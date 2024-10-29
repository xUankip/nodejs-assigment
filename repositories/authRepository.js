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
exports.createRole = async (roleName) => {
    const existingRole = await Role.findOne({ name: roleName });
    if (!existingRole) {
        const newRole = new Role({ name: roleName });
        return newRole.save();
    }
    return existingRole;
};

exports.createPermission = async (url, method) => {
    const permission = await Permission.findOne({ url, method });
    if (!permission) {
        const newPermission = new Permission({ url, method });
        return newPermission.save();
    }
    return permission;
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

    const permissionIds = [];
    for (const permission of permissions) {
        const { url, method } = permission;
        const permissionDoc = await exports.createPermission(url, method);
        permissionIds.push(permissionDoc._id);
    }

    role.permissions = permissionIds;
    await role.save();
    return role;
};
// exports.getUsers = async (req, res) => {
//     return User.find({})
// }

exports.getUsers = async (skip, limit) => {
    return User.find().skip(skip).limit(limit)
}

exports.findById = async (id) => {
    return User.findById({_id: id}).exec()
}

exports.updateUser = async (data) => {
    const user = await User.update(data)
    return user.save();
}

exports.HardDeleteUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    await user.deleteOne()
}