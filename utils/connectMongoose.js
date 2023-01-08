const mongoose = require("mongoose");

const connectMongoose = async () =>
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  });

export default connectMongoose;
