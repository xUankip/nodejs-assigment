const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');
const secretKey = 'secret-Key';

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token invalid" });
        }
        req.user = decoded;
        next();
    });
};

exports.checkPermission = async (req, res, next) => {
    try {
        const user = await authRepository.findUserById(req.user.userId);
        if (!user) {
            return res.status(401).json({ message: "Tài khoản không tồn tại" });
        }

        const userPermissions = user.role.reduce((acc, role) => {
            role.permissions.forEach(permissions => {
                acc.push({ url: permissions.url, method: permissions.method });
            });
            return acc;
        }, []);

        const hasPermission = userPermissions.some(p => p.url === req.path && p.method === req.method);
        if (!hasPermission) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Đã có lỗi xảy ra' });
    }
};
