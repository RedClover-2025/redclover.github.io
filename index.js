const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 8080;
const GITHUB_REPO = 'RedClover-2025/redclover.github.io';
const GITHUB_API = 'https://api.github.com/repos';

app.use(express.static('public'));
app.set('view engine', 'ejs');

const htmlTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - RedClover Capital</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; background: #fafafa; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    header { padding: 40px 0; border-bottom: 1px solid #e0e0e0; margin-bottom: 40px; }
    h1 { font-size: 2.5em; margin-bottom: 10px; color: #1a1a1a; font-weight: 700; }
    .tagline { font-size: 1.1em; color: #666; margin-bottom: 30px; }
    .content { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .section { margin-bottom: 40px; }
    .section h2 { font-size: 1.8em; margin-bottom: 20px; color: #1a1a1a; }
    .document-list { display: grid; gap: 15px; }
    .document { padding: 20px; background: #f5f5f5; border-radius: 6px; border-left: 4px solid #00a86b; transition: all 0.3s ease; }
    .document:hover { background: #efefef; transform: translateX(5px); }
    .document a { color: #00a86b; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 10px; }
    .document a:hover { text-decoration: underline; }
    .icon { font-size: 1.3em; }
    footer { margin-top: 60px; padding-top: 30px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>RedClover Capital</h1>
      <p class="tagline">Digital Finance Infrastructure & Tokenization</p>
    </header>
    <div class="content">
      ${content}
    </div>
    <footer>
      <p>&copy; 2025 RedClover Capital, Inc. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>
`;

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${GITHUB_API}/${GITHUB_REPO}/contents`);
    const files = response.data.filter(f => f.type === 'file' && f.name !== '.gitignore');
    
    let filesList = '<div class="section"><h2>Resources</h2><div class="document-list">';
    files.forEach(file => {
      const icon = file.name.endsWith('.pdf') ? '📄' : '📝';
      filesList += `<div class="document"><a href="${file.html_url}" target="_blank"><span class="icon">${icon}</span>${file.name}</a></div>`;
    });
    filesList += '</div></div>';
    
    const content = `
      <div class="section">
        <p>Welcome to RedClover Capital. We are pioneering digital finance infrastructure for the modern economy.</p>
      </div>
      ${filesList}
    `;
    
    res.send(htmlTemplate('Home', content));
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    const errorContent = '<p style="color: #d32f2f;">Unable to load resources. Please try again later.</p>';
    res.send(htmlTemplate('Error', errorContent));
  }
});

app.listen(PORT, () => {
  console.log(`RedClover Capital website running on port ${PORT}`);
});
