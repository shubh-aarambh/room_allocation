const User = require('../models/User');
const Resource = require('../models/Resource');
const Booking = require('../models/Booking');

const formatDate = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

exports.seedMockData = async (req, res) => {
  try {
    console.log('🌱 Starting seed process...');
    
    // 1. Create Admin User
    const adminEmail = 'admin@college.edu';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({ 
        name: 'Campus Admin', 
        email: adminEmail, 
        password: 'admin123', 
        role: 'admin' 
      });
      console.log('✓ Admin user created:', admin.email);
    } else {
      console.log('ℹ Admin user already exists');
    }

    // 2. Create Sample Students
    const studentsData = [
      { name: 'Alice Student', email: 'alice@student.edu', password: 'password1' },
      { name: 'Bob Student', email: 'bob@student.edu', password: 'password2' },
    ];
    const students = [];
    for (const s of studentsData) {
      let u = await User.findOne({ email: s.email });
      if (!u) {
        u = await User.create({ ...s, role: 'student' });
        console.log('✓ Student created:', u.email);
      } else {
        console.log('ℹ Student already exists:', s.email);
      }
      students.push(u);
    }

    // 3. Create Sample Resources - FIXED
    const resourcesData = [
      { 
        name: 'Main Seminar Hall', 
        type: 'seminar', 
        capacity: 200, 
        location: 'Building A', 
        availableFrom: '08:00', 
        availableTo: '20:00', 
        description: 'Large hall with projector and audio system' 
      },
      { 
        name: 'Computer Lab 1', 
        type: 'lab', 
        capacity: 40, 
        location: 'Building C', 
        availableFrom: '09:00', 
        availableTo: '18:00', 
        description: 'PC lab with 40 workstations' 
      },
      { 
        name: 'Sports Field', 
        type: 'sports', 
        capacity: 100, 
        location: 'Grounds', 
        availableFrom: '06:00', 
        availableTo: '21:00', 
        description: 'Outdoor field for sports activities' 
      },
      { 
        name: 'Classroom 101', 
        type: 'classroom', 
        capacity: 60, 
        location: 'Building B', 
        availableFrom: '08:00', 
        availableTo: '17:00', 
        description: 'Standard classroom with whiteboard' 
      },
    ];

    const resources = [];
    for (const r of resourcesData) {
      let found = await Resource.findOne({ name: r.name });
      if (!found) {
        found = await Resource.create(r);
        console.log('✓ Resource created:', found.name);
      } else {
        console.log('ℹ Resource already exists:', r.name);
      }
      resources.push(found);
    }

    console.log(`📦 Total resources in DB: ${resources.length}`);

    // 4. Create Sample Bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);

    const bookingsToCreate = [
      { 
        user: students[0], 
        resource: resources[0], 
        purpose: 'Guest lecture on AI', 
        date: todayStr, 
        startTime: '10:00', 
        endTime: '12:00', 
        status: 'approved' 
      },
      { 
        user: students[1], 
        resource: resources[1], 
        purpose: 'Programming lab session', 
        date: todayStr, 
        startTime: '13:00', 
        endTime: '15:00', 
        status: 'pending' 
      },
      { 
        user: students[0], 
        resource: resources[2], 
        purpose: 'Football practice', 
        date: tomorrowStr, 
        startTime: '16:00', 
        endTime: '18:00', 
        status: 'pending' 
      },
    ];

    let bookingsCreated = 0;
    for (const b of bookingsToCreate) {
      const exists = await Booking.findOne({
        userId: b.user._id,
        resourceId: b.resource._id,
        date: b.date,
        startTime: b.startTime,
      });
      if (!exists) {
        await Booking.create({
          userId: b.user._id,
          resourceId: b.resource._id,
          purpose: b.purpose,
          date: b.date,
          startTime: b.startTime,
          endTime: b.endTime,
          status: b.status,
        });
        bookingsCreated++;
        console.log('✓ Booking created:', b.purpose);
      }
    }

    // Final verification
    const finalCounts = {
      users: await User.countDocuments(),
      resources: await Resource.countDocuments(),
      bookings: await Booking.countDocuments()
    };

    console.log('✅ Seed completed successfully');
    console.log('📊 Final counts:', finalCounts);

    return res.json({
      message: 'Seed completed',
      admin: { email: adminEmail },
      students: students.map(s => ({ name: s.name, email: s.email })),
      resources: resources.map(r => ({ id: r._id, name: r.name, type: r.type, location: r.location })),
      counts: finalCounts
    });
  } catch (err) {
    console.error('❌ Seed error:', err);
    return res.status(500).json({ message: err.message, stack: err.stack });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResources = await Resource.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .populate('resourceId', 'name location type');

    return res.json({
      counts: {
        users: totalUsers,
        resources: totalResources,
        bookings: totalBookings,
        pending: pendingBookings,
        approved: approvedBookings,
        rejected: rejectedBookings,
      },
      recentBookings,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ message: err.message });
  }
};
