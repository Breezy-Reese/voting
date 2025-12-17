const mongoose = require('mongoose');
const Candidate = require('./models/candidate');
require('dotenv').config();

const candidates = [
  {
    name: 'John Doe',
    party: 'Party A',
    profilePic: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=John+Doe',
  },
  {
    name: 'Jane Smith',
    party: 'Party B',
    profilePic: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Jane+Smith',
  },
  {
    name: 'Bob Johnson',
    party: 'Party C',
    profilePic: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Bob+Johnson',
  },
  {
    name: 'Alice Brown',
    party: 'Party D',
    profilePic: 'https://via.placeholder.com/150/FFFF00/000000?text=Alice+Brown',
  },
  {
    name: 'Charlie Wilson',
    party: 'Party E',
    profilePic: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Charlie+Wilson',
  },
];

async function seedCandidates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing candidates
    await Candidate.deleteMany({});
    console.log('Cleared existing candidates');

    // Insert new candidates
    await Candidate.insertMany(candidates);
    console.log('Seeded candidates successfully');

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding candidates:', error);
    mongoose.connection.close();
  }
}

seedCandidates();
