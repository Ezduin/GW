const mongoose = require('mongoose')
const config = require("dotenv");

config.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(db => console.log('database is connected'))
    .catch(err => console.error(err))