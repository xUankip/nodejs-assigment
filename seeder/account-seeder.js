const mongoose = require('mongoose');
const Account = require('../models/account');
const { faker } = require('@faker-js/faker');

mongoose.connect('mongodb://127.0.0.1:27017/auth', {}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
  process.exit(1);
});

const accountSeeder = async () => {
  const accounts = [];
  for (let i = 0; i < 100; i++) {
    accounts.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password()
    });    
  }
  try {
    await Account.deleteMany();
    await Account.insertMany(accounts);
    console.log('Insert successfully');    
    process.exit();
  } catch (error) {
    console.error('Error seeding users', error);
    process.exit(1);
  }
};
accountSeeder();