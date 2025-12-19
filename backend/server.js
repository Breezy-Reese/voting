const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const User = require('./models/User');
const Candidate = require('./models/candidate');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Seed admin user on startup
    await seedAdmin();
    await seedCandidates();
  })
  .catch(err => console.log(err));

// Seed admin user
async function seedAdmin() {
  try {
    // Check by idNumber first since that's unique
    const existingAdmin = await User.findOne({ idNumber: 'ADMIN001' });
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      // Make sure it has admin role
      if (existingAdmin.role !== 'admin') {
        console.log('  → Updating role to admin...');
        existingAdmin.role = 'admin';
        await existingAdmin.save();
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
    console.log('✓ Admin user seeded successfully');
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
}

// Seed candidates if empty
async function seedCandidates() {
  try {
    const count = await Candidate.countDocuments();
    if (count > 0) {
      console.log('✓ Candidates already exist');
      return;
    }

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

    await Candidate.insertMany(candidates);
    console.log('✓ Candidates seeded successfully');
  } catch (error) {
    console.error('Error seeding candidates:', error.message);
  }
}

const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const voteRoutes = require('./routes/voteRoutes');
const healthRoutes = require('./routes/healthRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/health', healthRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
