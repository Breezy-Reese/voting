const mongoose = require('mongoose');
const Candidate = require('./models/candidate');
const User = require('./models/User');
require('dotenv').config();

const candidates = [
  {
    name: 'John Doe',
    party: 'Party A',
    profilePic: 'https://dummyimage.com/150x150/0000FF/FFFFFF&text=John+Doe',
  },
  {
    name: 'Jane Smith',
    party: 'Party B',
    profilePic: 'https://dummyimage.com/150x150/FF0000/FFFFFF&text=Jane+Smith',
  },
  {
    name: 'Bob Johnson',
    party: 'Party C',
    profilePic: 'https://dummyimage.com/150x150/00FF00/FFFFFF&text=Bob+Johnson',
  },
  {
    name: 'Alice Brown',
    party: 'Party D',
    profilePic: 'https://dummyimage.com/150x150/FFFF00/000000&text=Alice+Brown',
  },
  {
    name: 'Charlie Wilson',
    party: 'Party E',
    profilePic: 'https://dummyimage.com/150x150/FF00FF/FFFFFF&text=Charlie+Wilson',
  },
];

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'basil mutuku' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Admin user role:', existingAdmin.role);
      // Update role to make sure it's admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated admin role to admin');
      }
      return;
    }

    const adminUser = new User({
      username: 'basil mutuku',
      password: '#Basil123',
      fullName: 'Basil Mutuku',
      ward: 'Makueni Ward 1',
      subcounty: 'Makueni Subcounty 1',
      county: 'Makueni',
      idNumber: 'ADMIN001',
      role: 'admin',
    });
    await adminUser.save();
    console.log('Admin user seeded successfully with role:', adminUser.role);
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

async function seedCandidates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Seed admin user
    await seedAdmin();

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
