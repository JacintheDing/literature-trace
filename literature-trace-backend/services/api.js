const axios = require('axios');
const logger = require('../utils/logger');

// Fetch papers from PubMed API
async function fetchFromPubMed(query) {
  try {
    logger.info(`Fetching from PubMed API with query: ${query}`);
    
    // Use PubMed E-utilities API
    const eSearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`;
    const eSummaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`;
    const eFetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi`;
    
    // Step 1: Search for relevant papers
    const searchResponse = await axios.get(eSearchUrl, {
      params: {
        db: 'pubmed',
        term: query,
        retmax: 10,
        retmode: 'json',
        sort: 'relevance'
      }
    });
    
    const pmids = searchResponse.data.esearchresult.idlist;
    
    if (pmids.length === 0) {
      logger.info(`No papers found in PubMed for query: ${query}`);
      return [];
    }
    
    // Step 2: Fetch paper details
    const fetchResponse = await axios.get(eFetchUrl, {
      params: {
        db: 'pubmed',
        id: pmids.join(','),
        retmode: 'xml',
        rettype: 'abstract'
      }
    });
    
    // Simple XML parsing (in a real app, use a proper XML parser like xml2js)
    const xmlData = fetchResponse.data;
    
    // Extract paper information (this is a simplified example)
    // In a real implementation, use xml2js to properly parse the XML
    const papers = [];
    
    // For demonstration purposes, we'll return mock data
    // In a real app, parse the XML and extract the actual data
    pmids.forEach(pmid => {
      papers.push({
        title: `Sample Paper Title for ${query} (PMID: ${pmid})`,
        authors: ['Author 1', 'Author 2'],
        journal: 'Sample Journal',
        publicationDate: new Date(),
        abstract: `This is a sample abstract for a paper about ${query}.`,
        keywords: [query, 'sample', 'pubmed'],
        pmid: pmid,
        fullTextUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        source: 'pubmed'
      });
    });
    
    logger.info(`Fetched ${papers.length} papers from PubMed`);
    return papers;
  } catch (error) {
    logger.error('Error fetching from PubMed API:', error);
    throw error;
  }
}

// Fetch papers from ArXiv API
async function fetchFromArXiv(query) {
  try {
    logger.info(`Fetching from ArXiv API with query: ${query}`);
    
    const url = `https://export.arxiv.org/api/query`;
    
    const response = await axios.get(url, {
      params: {
        search_query: `all:${query}`,
        max_results: 10,
        sortBy: 'relevance',
        sortOrder: 'descending'
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // ArXiv returns Atom XML by default, but we can parse it
    // For demonstration purposes, we'll return mock data
    // In a real app, parse the XML and extract the actual data
    const papers = [];
    
    for (let i = 0; i < 5; i++) {
      papers.push({
        title: `Sample ArXiv Paper Title for ${query} (${i+1})`,
        authors: ['ArXiv Author 1', 'ArXiv Author 2'],
        journal: 'arXiv preprint',
        publicationDate: new Date(),
        abstract: `This is a sample abstract for an ArXiv paper about ${query}.`,
        keywords: [query, 'sample', 'arxiv'],
        arxivId: `arXiv:230${i}001${i}`,
        fullTextUrl: `https://arxiv.org/abs/230${i}001${i}`,
        source: 'arxiv'
      });
    }
    
    logger.info(`Fetched ${papers.length} papers from ArXiv`);
    return papers;
  } catch (error) {
    logger.error('Error fetching from ArXiv API:', error);
    throw error;
  }
}

module.exports = {
  fetchFromPubMed,
  fetchFromArXiv
};