const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');
const saltRounds = 10;
const secretKey = 'secret-Key';

exports.register = async (username, email, password, role) => {
    const checkUser = await authRepository.findUserByEmail(email);
    if (checkUser) {
        throw new Error('Email đã tồn tại');
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userRoles = await authRepository.findRolesByName(role);
    if (!userRoles.length) {
        throw new Error('Role không tồn tại');
    }
    const roleIds = userRoles.map(r => r._id);

    await authRepository.createUser(username, email, hashedPassword, roleIds);

    await authRepository.assignPermissionToRole(role, {
        urls: ['/admin'],
        methods: ['GET']
    }, {
        urls:['/user/create'],
        methods: ['POST']
    });
};

exports.login = async (email, password) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Tài khoản không tồn tại');
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        throw new Error('Sai mật khẩu');
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
    return token;
};
