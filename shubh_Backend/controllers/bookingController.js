const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const User = require('../models/User');

const sendEmailIfConfigured = async (to, subject, text) => {
  if (!process.env.SMTP_HOST) return;

  let nodemailer;
  try {
    // try to require nodemailer only when needed
    nodemailer = require('nodemailer');
  } catch (e) {
    // nodemailer not installed — skip sending emails but don't crash the server
    console.warn('nodemailer not installed; skipping email notifications');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

const toDateTime = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}:00`);
};

const overlaps = (aStart, aEnd, bStart, bEnd) => {
  return aStart < bEnd && bStart < aEnd;
};

exports.createBooking = async (req, res) => {
  try {
    const { resourceId, purpose, date, startTime, endTime } = req.body;
    if (!resourceId || !date || !startTime || !endTime) return res.status(400).json({ message: 'Missing fields' });

    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    // Optional: check within resource availability if provided
    if (resource.availableFrom && resource.availableTo) {
      const reqStart = toDateTime(date, startTime);
      const reqEnd = toDateTime(date, endTime);
      const availStart = toDateTime(date, resource.availableFrom);
      const availEnd = toDateTime(date, resource.availableTo);
      if (reqStart < availStart || reqEnd > availEnd) {
        return res.status(400).json({ message: 'Requested time outside resource availability' });
      }
    }

    // Overlap check: same resource, same date, status not rejected
    const existing = await Booking.find({
      resourceId,
      date,
      status: { $ne: 'rejected' },
    });

    const reqStart = toDateTime(date, startTime);
    const reqEnd = toDateTime(date, endTime);

    for (const b of existing) {
      const bStart = toDateTime(b.date, b.startTime);
      const bEnd = toDateTime(b.date, b.endTime);
      if (overlaps(reqStart, reqEnd, bStart, bEnd)) {
        return res.status(400).json({ message: 'Time slot overlaps with existing booking' });
      }
    }

    const booking = await Booking.create({
      userId: req.user._id,
      resourceId,
      purpose,
      date,
      startTime,
      endTime,
      status: 'pending',
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listBookings = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin ? {} : { userId: req.user._id };
    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('resourceId', 'name location type')
      .sort({ date: -1, startTime: 1 });
    
    // Add resourceName and userName for easier frontend access
    const enrichedBookings = bookings.map(b => ({
      ...b.toObject(),
      resourceName: b.resourceId?.name,
      userName: b.userId?.name
    }));
    
    console.log(`📋 Returning ${enrichedBookings.length} bookings for ${isAdmin ? 'admin' : 'student'}`);
    res.json(enrichedBookings);
  } catch (err) {
    console.error('❌ Error fetching bookings:', err);
    res.status(500).json({ message: err.message });
  }
};

const changeStatus = async (req, res, newStatus) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('userId', 'email name');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = newStatus;
    await booking.save();

    // optional email
    if (booking.userId && booking.userId.email) {
      const subject = `Your booking has been ${newStatus}`;
      const text = `Hello ${booking.userId.name || ''},\n\nYour booking for resource ${booking.resourceId} on ${booking.date} ${booking.startTime}-${booking.endTime} has been ${newStatus}.`;
      await sendEmailIfConfigured(booking.userId.email, subject, text);
    }

    res.json({ message: `Booking ${newStatus}`, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveBooking = (req, res) => changeStatus(req, res, 'approved');
exports.rejectBooking = (req, res) => changeStatus(req, res, 'rejected');

// ADD THIS: Generic status update handler
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findById(id).populate('userId', 'email name');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    booking.status = status;
    await booking.save();

    // optional email
    if (booking.userId && booking.userId.email) {
      const subject = `Your booking has been ${status}`;
      const text = `Hello ${booking.userId.name || ''},\n\nYour booking for resource ${booking.resourceId} on ${booking.date} ${booking.startTime}-${booking.endTime} has been ${status}.`;
      await sendEmailIfConfigured(booking.userId.email, subject, text);
    }

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
