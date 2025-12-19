const express = require('express');
const router = express.Router();
const Paper = require('../models/Paper');
const { fetchFromPubMed, fetchFromArXiv } = require('../services/api');
const logger = require('../utils/logger');

// Sync papers from external APIs
router.post('/:source', async (req, res) => {
  try {
    const { source } = req.params;
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    let papersData;
    
    switch (source.toLowerCase()) {
      case 'pubmed':
        papersData = await fetchFromPubMed(query);
        break;
      case 'arxiv':
        papersData = await fetchFromArXiv(query);
        break;
      default:
        return res.status(400).json({ error: 'Invalid source. Supported sources: pubmed, arxiv' });
    }
    
    // Save papers to database
    const savedPapers = [];
    
    for (const paperData of papersData) {
      // Check if paper already exists
      const existingPaper = await Paper.findOne({
        $or: [
          { doi: paperData.doi },
          { pmid: paperData.pmid },
          { arxivId: paperData.arxivId },
          { title: paperData.title }
        ]
      });
      
      if (!existingPaper) {
        const paper = new Paper(paperData);
        const savedPaper = await paper.save();
        savedPapers.push(savedPaper);
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Synced ${savedPapers.length} new papers from ${source}`,
      data: savedPapers
    });
  } catch (error) {
    logger.error(`Sync from ${req.params.source} error:`, error);
    res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
  }
});

module.exports = router;