import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();

// POST /api/scrape — extract job data from a URL
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required' });

    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000,
    });

    const $ = cheerio.load(html);

    // Extract common job posting patterns
    const title = $('h1').first().text().trim() ||
                  $('[class*="title"]').first().text().trim() ||
                  $('title').text().trim();

    const company = $('[class*="company"]').first().text().trim() ||
                    $('[data-company]').first().text().trim() ||
                    $('meta[property="og:site_name"]').attr('content') || '';

    const location = $('[class*="location"]').first().text().trim() ||
                     $('[class*="Location"]').first().text().trim() || '';

    const salary = $('[class*="salary"]').first().text().trim() ||
                   $('[class*="compensation"]').first().text().trim() || '';

    const description = $('[class*="description"]').first().text().trim().substring(0, 500) ||
                        $('meta[name="description"]').attr('content') || '';

    res.json({
      position: title,
      company: company,
      location: location,
      salary: salary,
      notes: description,
      jobUrl: url,
    });
  } catch (error) {
    res.status(422).json({
      message: 'Could not parse this URL. Try a different page.',
      error: error.message,
    });
  }
});

export default router;
