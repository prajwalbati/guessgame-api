const mongoose = require('mongoose');

let databaseLoader = {};
databaseLoader.init = async () => {
    mongoose.Promise = global.Promise;
    mongoose.set('returnOriginal', false);
    await mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
        console.log("Database connected successfully");
    }).catch(err => {
        console.error("***** Error while connecting database: "+err.message+" *****");
    });
};

module.exports = databaseLoader;