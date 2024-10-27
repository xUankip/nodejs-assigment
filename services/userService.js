const authRepository = require("../repositories/authRepository");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.getAllUsers =  (skip, limit) => {
    return authRepository.getUsers(skip, limit);
}
exports.getDetail = (id) => {
    return authRepository.findById(id);
}

exports.createUser = async (userData) => {
    const existingUser = await authRepository.findUserByEmail(userData.email);
    if (!existingUser) {
        throw new Error("Email already exists");
    }
    userData.passwordHash = await bcrypt.hash(userData.password, saltRounds);
    return authRepository.createUser(userData);
}
exports.deleteUser = async () => {
    const existingUser = await authRepository.findById();
    if (!existingUser) {
        throw new Error("User not found")
    }
    return authRepository.HardDeleteUser(existingUser);
}
