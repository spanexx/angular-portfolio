const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const router = express.Router();

// Cache for 15 minutes
const cache = new NodeCache({ stdTTL: 900 });

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'spanexx';

// Helper function to build headers
const buildHeaders = () => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-App'
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }
  
  return headers;
};

// Helper function to fetch user repositories
const fetchUserRepositories = async (username) => {
  const headers = buildHeaders();
  let repos = [];
  let page = 1;
  const perPage = 100;
  
  try {
    while (true) {
      const response = await axios.get(
        `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`,
        { headers }
      );
      
      repos = repos.concat(response.data);
      
      if (response.data.length < perPage) break;
      page++;
    }
    
    return repos;
  } catch (error) {
    console.error('Error fetching repositories:', error.message);
    throw error;
  }
};

// Helper function to fetch repository commits
const fetchRepositoryCommits = async (username, repoName) => {
  const headers = buildHeaders();
  
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${username}/${repoName}/commits?per_page=5`,
      { headers }
    );
    
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch commits for ${repoName}:`, error.message);
    return [];
  }
};

// GET /api/github/commits - Get recent commits
router.get('/commits', async (req, res) => {
  try {
    const cacheKey = `commits_${GITHUB_USERNAME}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        fromCache: true,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`Fetching fresh GitHub data for ${GITHUB_USERNAME}...`);
    
    // Fetch repositories
    const repos = await fetchUserRepositories(GITHUB_USERNAME);
    console.log(`Found ${repos.length} repositories`);
    
    // Get commits from top 5 most recently updated repos
    const recentRepos = repos.slice(0, 5);
    const allCommits = [];
    
    for (const repo of recentRepos) {
      const commits = await fetchRepositoryCommits(GITHUB_USERNAME, repo.name);
      const commitsWithRepo = commits.map(commit => ({
        ...commit,
        repository: repo.name,
        repository_url: repo.html_url
      }));
      allCommits.push(...commitsWithRepo);
    }
    
    // Sort by date and take latest 20
    allCommits.sort((a, b) => 
      new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
    );
    
    const finalCommits = allCommits.slice(0, 20);
    
    // Cache the result
    cache.set(cacheKey, finalCommits);
    
    res.json({
      success: true,
      data: finalCommits,
      fromCache: false,
      timestamp: new Date().toISOString(),
      repositoriesChecked: recentRepos.length
    });
    
  } catch (error) {
    console.error('GitHub API Error:', error.message);
    
    // Return appropriate error response
    let statusCode = 500;
    let message = 'Failed to fetch GitHub data';
    
    if (error.response) {
      statusCode = error.response.status;
      if (statusCode === 403) {
        message = 'GitHub API rate limit exceeded';
      } else if (statusCode === 404) {
        message = 'GitHub user not found';
      } else if (statusCode === 401) {
        message = 'GitHub authentication failed';
      }
    }
    
    res.status(statusCode).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/github/repos - Get user repositories
router.get('/repos', async (req, res) => {
  try {
    const cacheKey = `repos_${GITHUB_USERNAME}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        fromCache: true
      });
    }
    
    const repos = await fetchUserRepositories(GITHUB_USERNAME);
    
    // Cache for longer (30 minutes) since repos change less frequently
    cache.set(cacheKey, repos, 1800);
    
    res.json({
      success: true,
      data: repos,
      fromCache: false,
      count: repos.length
    });
    
  } catch (error) {
    console.error('Error fetching repositories:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch repositories'
    });
  }
});

// POST /api/github/refresh - Force refresh cache
router.post('/refresh', async (req, res) => {
  try {
    // Clear cache
    cache.flushAll();
    
    // Fetch fresh data
    const repos = await fetchUserRepositories(GITHUB_USERNAME);
    const allCommits = [];
    
    for (const repo of repos.slice(0, 5)) {
      const commits = await fetchRepositoryCommits(GITHUB_USERNAME, repo.name);
      const commitsWithRepo = commits.map(commit => ({
        ...commit,
        repository: repo.name,
        repository_url: repo.html_url
      }));
      allCommits.push(...commitsWithRepo);
    }
    
    allCommits.sort((a, b) => 
      new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
    );
    
    const finalCommits = allCommits.slice(0, 20);
    
    // Update cache
    cache.set(`commits_${GITHUB_USERNAME}`, finalCommits);
    cache.set(`repos_${GITHUB_USERNAME}`, repos, 1800);
    
    res.json({
      success: true,
      message: 'GitHub data refreshed successfully',
      data: finalCommits,
      repositoriesChecked: repos.slice(0, 5).length
    });
    
  } catch (error) {
    console.error('Error refreshing GitHub data:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh GitHub data'
    });
  }
});

module.exports = router;