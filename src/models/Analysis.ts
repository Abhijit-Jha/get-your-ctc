import mongoose from 'mongoose';

// Only define the schema if we're on the server
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

const AnalysisSchema = new mongoose.Schema({
  githubUsername: {
    type: String,
    required: true,
    index: true,
  },
  githubUrl: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: String,
    required: true,
  },
  targetRole: {
    type: String,
    required: true,
  },
  ctc: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  githubData: {
    publicRepos: Number,
    followers: Number,
    following: Number,
    totalStars: Number,
    totalForks: Number,
    languages: mongoose.Schema.Types.Mixed,
    recentActivity: Number,
    accountAge: String,
    location: String,
    company: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for faster queries
AnalysisSchema.index({ githubUsername: 1, createdAt: -1 });

// Safely export the model
const Analysis = mongoose.models?.Analysis || mongoose.model('Analysis', AnalysisSchema);

export default Analysis;

