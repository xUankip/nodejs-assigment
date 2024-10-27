const authService = require('../services/authService');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        await authService.register(username, email, password, role);
        return res.render('auth/register.ejs', { message: 'Đăng ký thành công' });
    } catch (err) {
        return res.render('auth/register.ejs', { message: err.message || 'Đã có lỗi xảy ra vui lòng đăng kí lại' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password);
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        return res.render('auth/profile.ejs');
    } catch (err) {
        return res.render('auth/login.ejs', { message: err.message || 'Đã có lỗi xảy ra, vui lòng thử lại' });
    }
};
