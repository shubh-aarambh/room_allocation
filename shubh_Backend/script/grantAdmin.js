const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const grantAdminAccess = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Update the user's isAdmin field
    const result = await User.updateOne(
      { email },
      { $set: { isAdmin: true } }
    );

    if (result.modifiedCount > 0) {
      console.log(`Admin access granted to user with email: ${email}`);
    } else {
      console.log(`No user found with email: ${email}`);
    }

    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Replace with your email
grantAdminAccess('shubhshukla1006@gmail.com');