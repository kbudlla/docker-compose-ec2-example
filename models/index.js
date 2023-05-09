const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI ||
    "mongodb://mongo_1:27017/booksData",{ useNewUrlParser: true, useUnifiedTopology: true});

module.exports.books = require("./books.js");
