// AI-Powered Static Website Generator - Backend (Express + OpenAI)
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const JSZip = require('jszip');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// OpenAI client
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY missing. Set it in backend/.env');
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'AI Website Generator backend running' });
});

app.post('/generate', async (req, res) => {
  try {
    const prompt = (req.body?.prompt || '').toString().trim();
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const systemPrompt = `
You are an expert front-end developer. Create a COMPLETE, single-file HTML5 document.
Rules:
- Return ONLY raw HTML (no markdown fences).
- Include <head> with <meta charset> and <meta name="viewport"> and a descriptive <title>.
- Include a <style> block with all CSS (no external frameworks).
- Make it responsive (use flexbox/grid).
- Use semantic HTML (header, main, section, footer).
- Add subtle hover effects and accessible contrast.
- If images are requested, use placeholder images with descriptive alt text.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const html = completion.choices?.[0]?.message?.content || '';
    return res.json({ html });
  } catch (err) {
    console.error('OpenAI generation error:', err);
    return res.status(500).json({ error: 'Generation failed', details: err.message });
  }
});

app.post('/download-zip', async (req, res) => {
  try {
    const { html, filename = 'website' } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Create a new ZIP instance
    const zip = new JSZip();

    // Extract inline <style> and <script> into separate files
    const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
    const scriptMatches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];

    let cssBundle = styleMatches.map(m => m[1]).join('\n\n');
    let jsBundle = scriptMatches
      .filter(m => !/src\s*=/.test(m[0]))
      .map(m => m[1])
      .join('\n\n');

    // Remove inline blocks from HTML
    let indexHtml = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace('</head>', '  <link rel="stylesheet" href="assets/styles.css" />\n</head>')
      .replace('</body>', '  <script src="assets/script.js"></script>\n</body>');

    // Folders
    const assets = zip.folder('assets');
    const images = assets.folder('images');

    // Basic README
    const readme = `# ${filename}\n\nStatic site exported from AI Website Generator.\n\nHow to use:\n- Open index.html in a browser\n- Or open folder in VS Code and use Live Server\n\nStructure:\n- index.html\n- assets/styles.css\n- assets/script.js\n- assets/images/\n`;

    // Write files
    zip.file('index.html', indexHtml);
    assets.file('styles.css', cssBundle || '/* Styles */');
    assets.file('script.js', jsBundle || '// Scripts');
    zip.file('README.md', readme);

    // Generate the ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.zip"`);
    res.setHeader('Content-Length', zipBuffer.length);
    
    // Send the ZIP file
    res.send(zipBuffer);
  } catch (err) {
    console.error('ZIP generation error:', err);
    return res.status(500).json({ error: 'ZIP generation failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log('POST /generate to create HTML from a prompt');
});
