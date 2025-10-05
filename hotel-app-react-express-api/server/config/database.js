import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
    try {
        let mongoURI;

        // Check if using MongoDB Atlas (connection string format)
        if (process.env.MONGODB_URI) {
            mongoURI = process.env.MONGODB_URI;
        } else {
            // Build traditional connection string for local MongoDB
            mongoURI = `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=${config.authSource}`;
        }

        const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

export default connectDB;
