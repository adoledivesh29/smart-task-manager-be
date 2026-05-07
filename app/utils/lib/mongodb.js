const mongoose = require('mongoose');

class MongoClient {
  constructor() {
    this.options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    };
    this.mongodb = null;
  }

  async initialize() {
    try {
      const client = await mongoose.connect(process.env.DB_URL, this.options);
      log.yellow('Database connected 🧬 \n---------------------------------');
      this.mongodb = client;
    } catch (error) {
      throw error;
    }
  }

  mongify(id) {
    return new mongoose.Types.ObjectId(String(id));
  }
}

module.exports = new MongoClient();
