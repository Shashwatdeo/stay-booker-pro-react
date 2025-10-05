import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    hotelCode: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    images: [
        {
            imageUrl: { type: String, required: true },
            accessibleText: { type: String, default: '' },
        },
    ],
    subtitle: {
        type: String,
        required: true,
    },
    benefits: {
        type: [String],
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    ratings: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;