const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  // Ensure we're working with a plain object, not a Mongoose document
  const userObj = user.toObject ? user.toObject() : user;
  
  const payload = {
    id: userObj._id.toString(),
    email: userObj.email,
    name: userObj.name,
    role: userObj.role
  };
  
  console.log('🔑 Generating token with payload:', payload);
  
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
  
  // Verify the token was created correctly
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✓ Token verified, decoded payload:', decoded);
  
  return token;
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password, role: role || 'student' });
    console.log(`✓ New user registered: ${email} (${user.role})`);
    
    const token = generateToken(user);
    
    res.status(201).json({
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token: token,
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('👤 Found user:', { 
      id: user._id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`✓ User logged in: ${email} (${user.role})`);
    
    const token = generateToken(user);
    
    const response = {
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token: token,
    };
    
    console.log('📤 Login response:', JSON.stringify(response, null, 2));
    
    res.json(response);
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: err.message });
  }
};
