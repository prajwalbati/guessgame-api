const userModel = require('../models/user');

let seedUsers = async() => {
    console.log("Seeding users");
    let usersCount = await userModel.countDocuments();
    if(usersCount > 0) return;
    const users = [{
        username: 'Player 1',
        type: 'manual'
    }, {
        username: 'Player 2',
        type: 'auto'
    }, {
        username: 'Player 3',
        type: 'auto'
    }, {
        username: 'Player 4',
        type: 'auto'
    }, {
        username: 'Player 5',
        type: 'auto'
    }];
    await userModel.insertMany(users);
};

module.exports = { seedUsers };