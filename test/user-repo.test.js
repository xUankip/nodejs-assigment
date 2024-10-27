const mongoose = require('mongoose');
const authRepository = require('../repositories/authRepository')
const User = require('../models/userModel')
const Role = require('../models/roleModel')
const Permission = require('../models/permissionModel')

const dotenv = require("dotenv");
console.log(process.env.NODE_ENV);
const env = process.env.NODE_ENV || 'testing'; //
const envFile = process.env.NODE_ENV ? `.env.${env}` : '.env'
console.log(envFile);
dotenv.config({ path: envFile });

beforeAll(async () =>{
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, {});
    console.log('Connect success');
});

afterAll(async () =>{
    await mongoose.connection.close();
    console.log('Sau tất cả, mình lại close kết nối!');
});

afterEach(async () =>{
    console.log('Sau mỗi case, mình lại chạy!');
});

describe('User repository', ()=> {
    it('should get user with role and permission', async ()=>{
        console.log('Hello');
        const user = await authRepository.findByIdWithRoleAndPermission('6711fa416bbab772002ea15d');
        console.log('Hello1');
        console.log(user);
        console.log(user.role);
        console.log(user.role[0].permissions);
        console.log('Hello2');
        // const userPermission = user.roles.reduce((up, role)=> {
        //     role.permissions.forEach((permission) => {
        //         up.push({url: permission.url, method: permission.method});
        //     });
        //     return up;
        // }, []);
        const mapUserPermission = [];
        for(let i = 0; i < user.role.length; i++){
            const userPermission = user.role[i].permissions;
            for (let j = 0; j < userPermission.length; j++) {
                const p = userPermission[j];
                mapUserPermission.push({url: p.url, method: p.method});
            }
        }
        console.log(mapUserPermission);
        const currentUrl = '/user/create';
        const currentMethod = 'POST';
        const hasPermission = mapUserPermission.some(
            p => p.url === currentUrl && p.method === currentMethod
        );
        console.log(hasPermission);
    });
})