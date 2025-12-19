const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  authors: {
    type: [String],
    required: true
  },
  journal: {
    type: String,
    trim: true
  },
  publicationDate: {
    type: Date
  },
  abstract: {
    type: String,
    trim: true
  },
  keywords: {
    type: [String],
    trim: true
  },
  doi: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  pmid: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  arxivId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  fullTextUrl: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    required: true,
    enum: ['pubmed', 'arxiv', 'other']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt field on save
PaperSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Paper', PaperSchema);