const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'usermodel'
  },
  date: {
    type: Date
  },
  time: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('bookingmodel', bookingSchema);
