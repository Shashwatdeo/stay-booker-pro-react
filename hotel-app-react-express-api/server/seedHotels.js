import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import Hotel from './models/Hotel.model.js';
import { connectDB } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedHotels() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Read hotels.json
    const hotelsPath = path.join(__dirname, 'hotels.json');
    const hotelsData = JSON.parse(fs.readFileSync(hotelsPath, 'utf-8'));

    // Transform hotel data to match our schema and frontend expectation (objects with imageUrl, accessibleText)
    const transformedHotels = hotelsData.map((hotel) => ({
      hotelCode: hotel.hotelCode,
      title: hotel.title,
      images: Array.isArray(hotel.images)
        ? hotel.images.map((img) => ({
            imageUrl: img.imageUrl,
            accessibleText: img.accessibleText || hotel.title,
          }))
        : [],
      subtitle: hotel.subtitle,
      benefits: Array.isArray(hotel.benefits) ? hotel.benefits : [],
      price: hotel.price,
      ratings: hotel.ratings,
      city: hotel.city,
    }));

    // Remove all existing hotels (optional, for clean seed)
    await Hotel.deleteMany({});

    // Insert hotels
    await Hotel.insertMany(transformedHotels);
    console.log('Hotels seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding hotels:', err);
    process.exit(1);
  }
}

seedHotels();