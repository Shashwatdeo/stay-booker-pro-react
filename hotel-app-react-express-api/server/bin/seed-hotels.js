import db from '../models/index.js';
const Hotel = db.Hotel;

const hotels = [
  {
    title: 'Hyatt Pune',
    images: [
      { imageUrl: '/images/hotels/481481762/481481762.jpg', accessibleText: 'hyatt pune hotel' }
    ],
    subtitle: 'Kalyani Nagar, Pune | 3.3 kms from city center',
    benefits: ['Free cancellation', 'No prepayment needed – pay at the property'],
    price: '18900',
    ratings: '5',
    city: 'pune',
  },
  {
    title: 'Courtyard by Marriott Pune Hinjewadi',
    images: [
      { imageUrl: '/images/hotels/465660377/465660377.jpg', accessibleText: 'Courtyard by Marriott Pune' }
    ],
    subtitle: '500 meters from the Rajiv Gandhi Infotech Park',
    benefits: ['Free cancellation', 'No prepayment needed – pay at the property', 'Free wifi', 'Free lunch'],
    price: '25300',
    ratings: '4',
    city: 'pune',
  },
  {
    title: 'The Westin Pune Koregaon Park',
    images: [
      { imageUrl: '/images/hotels/469186143/469186143.jpg', accessibleText: 'The Westin Pune Koregaon Park' }
    ],
    subtitle: '5.4 km from centre',
    benefits: ['Free cancellation', 'No prepayment needed – pay at the property', 'Free wifi'],
    price: '11300',
    ratings: '5',
    city: 'pune',
  },
  // Add more hotels as needed
];

async function seedHotels() {
  try {
    await db.sequelize.sync();
    await Hotel.destroy({ where: {} }); // Clear existing
    for (const hotel of hotels) {
      await Hotel.create(hotel);
    }
    console.log('Hotels seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hotels:', error);
    process.exit(1);
  }
}

seedHotels(); 