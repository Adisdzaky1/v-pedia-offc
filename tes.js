require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  whitelistIp: [String]
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function runMigration() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/appdb';

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for migration.');

    const result = await User.updateMany(
      { whitelistIp: { $exists: false } },
      { $set: { whitelistIp: ['0.0.0.0'] } }
    );

    console.log(`Migration complete.`);
    console.log(`Users matched: ${result.matchedCount}`);
    console.log(`Users updated: ${result.modifiedCount}`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
}

runMigration();