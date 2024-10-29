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

    // Đảm bảo role tồn tại trong database
    const userRoles = [];
    for (const roleName of role) {
        const newRole = await authRepository.createRole(roleName);
        userRoles.push(newRole._id);
    }

    await authRepository.createUser(username, email, hashedPassword, userRoles);

    // Gán permissions cho từng role nếu cần thiết
    if (role.includes('Admin')) {
        await authRepository.assignPermissionToRole('Admin', [
            { url: '/admin', method: 'GET' },
            { url: '/admin', method: 'POST' },
            { url: '/admin', method: 'DELETE' },
        ]);
    }

    if (role.includes('User')) {
        await authRepository.assignPermissionToRole('User', [
            { url: '/user', method: 'POST' },
            { url: '/user', method: 'GET' },
            { url: '/user1', method: 'POST' },
            { url: '/user1', method: 'GET' },
            { url: '/user2', method: 'POST' },
            { url: '/user2', method: 'GET' },
        ]);
    }

    if (role.includes('Editor')) {
        await authRepository.assignPermissionToRole('Editor', [
            { url: '/editor', method: 'POST' },
            { url: '/editor', method: 'GET' },
            { url: '/editor1', method: 'POST' },
            { url: '/editor1', method: 'GET' },
        ]);
    }
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
