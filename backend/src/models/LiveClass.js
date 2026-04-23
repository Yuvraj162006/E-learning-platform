import mongoose from 'mongoose';

const liveClassSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title']
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  meetingLink: {
    type: String
  },
  agoraChannelName: {
    type: String
  },
  agoraToken: {
    type: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  recordingUrl: {
    type: String
  },
  isRecorded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const LiveClass = mongoose.model('LiveClass', liveClassSchema);

export default LiveClass;
