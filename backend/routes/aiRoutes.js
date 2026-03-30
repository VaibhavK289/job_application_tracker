import express from 'express';

const router = express.Router();

// POST /api/ai/cover-letter
router.post('/cover-letter', async (req, res) => {
  try {
    const { company, position, notes } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        message: 'AI features require a Gemini API key. Set GEMINI_API_KEY in your backend .env file.',
      });
    }

    const prompt = `Write a concise, professional cover letter for a ${position} position at ${company}. 
The applicant's relevant notes: ${notes || 'No specific notes provided.'}
Keep it under 250 words. Be warm but professional. Do not use placeholder brackets.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ message: 'Gemini API error', error: data });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    res.json({ coverLetter: text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ai/resume-score
router.post('/resume-score', async (req, res) => {
  try {
    const { position, company, resumeText } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        message: 'AI features require a Gemini API key. Set GEMINI_API_KEY in your backend .env file.',
      });
    }

    const prompt = `Score the following resume against this job posting.
Job: ${position} at ${company}.
Resume text: ${resumeText || 'Not provided'}

Return a JSON object with:
- "score": a number 0-100
- "missing_keywords": array of 3-5 keywords the resume should include
- "suggestion": one sentence of advice

Return ONLY valid JSON, nothing else.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Try to parse the AI's JSON response
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      res.json(parsed);
    } catch {
      res.json({ score: 0, missing_keywords: [], suggestion: text });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
