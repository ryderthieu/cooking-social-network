const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  async function connect() {
    try {
      await mongoose.connect(uri);
    }
    catch {
      console.log("Error connecting to MongoDB");
    }
  }
  connect().catch(console.dir);
  module.exports = {connect}