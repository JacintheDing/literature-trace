const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const { redisClient } = require('../server');
const logger = require('../utils/logger');

// Cache middleware
const cache = (duration) => {
  return (req, res, next) => {
    if (!redisClient) return next();
    
    const key = `cache:${req.originalUrl}`;
    
    redisClient.get(key, (error, result) => {
      if (error) {
        logger.warn('Redis cache error:', error);
        return next();
      }
      
      if (result) {
        logger.info(`Cache hit for ${key}`);
        res.status(200).json(JSON.parse(result));
      } else {
        res.sendResponse = res.json;
        res.json = (body) => {
          redisClient.setex(key, duration, JSON.stringify(body));
          res.sendResponse(body);
        };
        next();
      }
    });
  };
};

// Search papers
router.get('/search', cache(3600), async (req, res) => {
  try {
    const { query, type = 'all', page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const skip = (page - 1) * limit;
    
    // Build search query
    let searchQuery = {};
    
    const regexQuery = { $regex: new RegExp(query, 'i') };
    
    switch (type) {
      case 'title':
        searchQuery.title = regexQuery;
        break;
      case 'subject':
        searchQuery.abstract = regexQuery;
        break;
      case 'keyword':
        searchQuery.keywords = regexQuery;
        break;
      case 'author':
        searchQuery.authors = regexQuery;
        break;
      default:
        // Search all fields
        searchQuery.$or = [
          { title: regexQuery },
          { abstract: regexQuery },
          { keywords: regexQuery },
          { authors: regexQuery },
          { journal: regexQuery }
        ];
    }
    
    // Execute search
    const papers = await Paper.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ publicationDate: -1 });
    
    const total = await Paper.countDocuments(searchQuery);
    
    res.status(200).json({
      success: true,
      data: papers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Search papers error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get paper by ID
router.get('/:id', cache(3600), async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    
    if (!paper) {
      return res.status(404).json({ success: false, error: 'Paper not found' });
    }
    
    res.status(200).json({ success: true, data: paper });
  } catch (error) {
    logger.error('Get paper by ID error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;