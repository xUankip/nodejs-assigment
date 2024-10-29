const mongoose = require('mongoose');
const Permissions = require('../models/permissionModel');
const Role = require('../models/roleModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Kết nối đến MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/auth', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
});

// Tạo permissions
const permissionAdminGet = new Permissions({
    name: 'Admin Access',
    url: '/admin',
    method: 'GET',
});

const permissionCreateUserPost = new Permissions({
    name: 'Create User',
    url: '/user',
    method: 'POST',
},{
    name: 'User1',
    url: '/user1',
    method: 'POST',
},{
    name: 'User2',
    url: '/user2',
    method: 'GET',
},{
    name: 'User1',
    url: '/user1',
    method: 'GET',
});

const createUser = async (username, email, password, role) => {
    try {
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            username,
            email,
            password: hashPassword,
            role: role,
        });
        await newUser.save();
        console.log(`User ${username} created`);
    } catch (err) {
        console.log(err);
    }
};

const seedData = async () => {
    try {
        await permissionAdminGet.save();
        await permissionCreateUserPost.save();

        const roleAdmin = new Role({
            name: 'Admin',
            permission: [permissionAdminGet._id, permissionCreateUserPost._id], // Sử dụng _id từ permission đã lưu
        });

        const roleUser = new Role({
            name: 'User',
            permission: [],
        });

        await roleAdmin.save();
        await roleUser.save();

        await createUser('XuanNgo', 'xuan@mail.com', '1234', roleAdmin._id);
        await createUser('TruongNgo', 'truong@mail.com', '12345', roleUser._id);

        console.log('Permissions and roles seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding permissions:', error);
        process.exit(1);
    }
};

seedData(); // Gọi hàm seeding