/* eslint-disable no-undef */
import mongoose from 'mongoose';
import '../config/dotenv.js'


mongoose.connect(process.env.DATABASE_TOKEN);

const db = mongoose.connection;

db.on('error', console.error.bind(console, '❌ MongoDB connection error: '));
db.once('open', () => {
  console.log('✅ Successful connection to MongoDB! ');
});


export { db as dataBase };