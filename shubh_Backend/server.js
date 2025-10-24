const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect DB and auto-seed
const startServer = async () => {
  try {
    await connectDB();
    console.log('✓ Database connected successfully');

    // Auto-seed mock data on first run
    const User = require('./models/User');
    const Resource = require('./models/Resource');
    const Booking = require('./models/Booking');

    // Check for resources instead of admin (since admin already exists)
    const resourceCount = await Resource.countDocuments();
    
    if (resourceCount === 0) {
      console.log('⚡ No resources found - seeding mock data...');
      const { seedMockData } = require('./controllers/adminController');
      
      // Create a mock response object to capture seed result
      const mockRes = {
        json: (data) => {
          console.log('✓ Seed completed:', data.message);
          console.log('✓ Created admin:', data.admin?.email);
          console.log('✓ Created students:', data.students?.length || 0);
          console.log('✓ Created resources:', data.resources?.length || 0);
          return mockRes;
        },
        status: (code) => mockRes
      };
      
      await seedMockData({ body: {} }, mockRes);
      
      // Verify data was created
      const userCount = await User.countDocuments();
      const newResourceCount = await Resource.countDocuments();
      const bookingCount = await Booking.countDocuments();
      
      console.log('📊 Database populated:');
      console.log(`   Users: ${userCount}`);
      console.log(`   Resources: ${newResourceCount}`);
      console.log(`   Bookings: ${bookingCount}`);
    } else {
      console.log('✓ Mock data already exists, skipping seed');
      
      // Show current counts
      const userCount = await User.countDocuments();
      const bookingCount = await Booking.countDocuments();
      
      console.log('📊 Current database state:');
      console.log(`   Users: ${userCount}`);
      console.log(`   Resources: ${resourceCount}`);
      console.log(`   Bookings: ${bookingCount}`);
    }

    // Mount routes AFTER seeding
    app.use('/api/auth', authRoutes);
    app.use('/api/resources', resourceRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/admin', adminRoutes);

    // Add a simple test route to verify data
    app.get('/api/test/data', async (req, res) => {
      try {
        const users = await User.countDocuments();
        const resources = await Resource.find().select('name type location');
        const bookings = await Booking.countDocuments();
        
        res.json({
          message: 'Database connection OK',
          counts: { users, resources: resources.length, bookings },
          sampleResources: resources
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // Basic error handler
    app.use((err, req, res, next) => {
      console.error('❌ Error:', err);
      const status = err.status || 500;
      res.status(status).json({ message: err.message || 'Server error' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}`);
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test/data\n`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
