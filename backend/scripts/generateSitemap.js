/**
 * Sitemap Generator
 * Generates sitemap.xml for SEO optimization
 * Run with: node backend/scripts/generateSitemap.js
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Database models
const MongoTutorial = require('../models/MongoTutorial');
const DatabaseTutorial = require('../models/DatabaseTutorial');
const CodingChallenge = require('../models/CodingChallenge');

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://seek-platform.com';
const OUTPUT_PATH = path.join(__dirname, '../../frontend/public/sitemap.xml');

// Static pages with priority and change frequency
const STATIC_PAGES = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/dashboard', priority: 0.9, changefreq: 'daily' },
  { url: '/tutorials', priority: 0.9, changefreq: 'weekly' },
  { url: '/database-tutorials', priority: 0.9, changefreq: 'weekly' },
  { url: '/challenges', priority: 0.9, changefreq: 'weekly' },
  { url: '/playground', priority: 0.8, changefreq: 'monthly' },
  { url: '/translator', priority: 0.8, changefreq: 'monthly' },
  { url: '/database-translator', priority: 0.8, changefreq: 'monthly' },
  { url: '/games', priority: 0.7, changefreq: 'monthly' },
  { url: '/achievements', priority: 0.6, changefreq: 'monthly' },
  { url: '/profile', priority: 0.5, changefreq: 'weekly' },
  { url: '/settings', priority: 0.4, changefreq: 'monthly' }
];

/**
 * Generate sitemap URL entry
 */
function generateUrlEntry(url, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Connect to MongoDB
 */
async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/seek_platform';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Fetch all dynamic content
 */
async function fetchDynamicContent() {
  console.log('\nFetching dynamic content...');

  try {
    // Fetch tutorials
    const tutorials = await MongoTutorial.find({})
      .select('_id slug title updatedAt')
      .sort({ updatedAt: -1 })
      .lean();
    console.log(`✓ Found ${tutorials.length} programming tutorials`);

    // Fetch database tutorials
    const databaseTutorials = await DatabaseTutorial.find({})
      .select('_id slug title updatedAt')
      .sort({ updatedAt: -1 })
      .lean();
    console.log(`✓ Found ${databaseTutorials.length} database tutorials`);

    // Fetch coding challenges
    const challenges = await CodingChallenge.find({})
      .select('_id slug title updatedAt')
      .sort({ updatedAt: -1 })
      .lean();
    console.log(`✓ Found ${challenges.length} coding challenges`);

    return {
      tutorials,
      databaseTutorials,
      challenges
    };
  } catch (error) {
    console.error('✗ Error fetching dynamic content:', error);
    throw error;
  }
}

/**
 * Generate sitemap XML
 */
async function generateSitemap() {
  console.log('='.repeat(60));
  console.log('Generating Sitemap for Seek Platform');
  console.log('='.repeat(60));

  try {
    // Connect to database
    await connectDatabase();

    // Fetch dynamic content
    const { tutorials, databaseTutorials, challenges } = await fetchDynamicContent();

    // Start building sitemap
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const now = new Date().toISOString();

    // Add static pages
    console.log('\nAdding static pages...');
    STATIC_PAGES.forEach(page => {
      sitemap += generateUrlEntry(page.url, now, page.changefreq, page.priority);
      sitemap += '\n';
    });
    console.log(`✓ Added ${STATIC_PAGES.length} static pages`);

    // Add programming tutorials
    console.log('\nAdding programming tutorials...');
    tutorials.forEach(tutorial => {
      const url = `/tutorials/${tutorial.slug || tutorial._id}`;
      const lastmod = (tutorial.updatedAt || new Date()).toISOString();
      sitemap += generateUrlEntry(url, lastmod, 'weekly', 0.8);
      sitemap += '\n';
    });
    console.log(`✓ Added ${tutorials.length} programming tutorials`);

    // Add database tutorials
    console.log('\nAdding database tutorials...');
    databaseTutorials.forEach(tutorial => {
      const url = `/database-tutorials/${tutorial.slug || tutorial._id}`;
      const lastmod = (tutorial.updatedAt || new Date()).toISOString();
      sitemap += generateUrlEntry(url, lastmod, 'weekly', 0.8);
      sitemap += '\n';
    });
    console.log(`✓ Added ${databaseTutorials.length} database tutorials`);

    // Add coding challenges
    console.log('\nAdding coding challenges...');
    challenges.forEach(challenge => {
      const url = `/challenges/${challenge.slug || challenge._id}`;
      const lastmod = (challenge.updatedAt || new Date()).toISOString();
      sitemap += generateUrlEntry(url, lastmod, 'weekly', 0.7);
      sitemap += '\n';
    });
    console.log(`✓ Added ${challenges.length} coding challenges`);

    // Close sitemap
    sitemap += '</urlset>';

    // Write sitemap to file
    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');

    const totalUrls = STATIC_PAGES.length + tutorials.length + databaseTutorials.length + challenges.length;

    console.log('\n' + '='.repeat(60));
    console.log(`✓ Sitemap generated successfully!`);
    console.log(`  Total URLs: ${totalUrls}`);
    console.log(`  Output: ${OUTPUT_PATH}`);
    console.log(`  Size: ${(sitemap.length / 1024).toFixed(2)} KB`);
    console.log('='.repeat(60));

    // Close database connection
    await mongoose.disconnect();
    console.log('\n✓ Database connection closed');

  } catch (error) {
    console.error('\n✗ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the generator
generateSitemap()
  .then(() => {
    console.log('\n✓ Sitemap generation complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Fatal error:', error);
    process.exit(1);
  });
