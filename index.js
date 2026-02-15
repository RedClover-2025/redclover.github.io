const express = require('express');
const path = require('path');
const {Storage} = require('@google-cloud/storage');
const app = express();
const PORT = process.env.PORT || 8080;
const BUCKET_NAME = 'redclover-site';

const storage = new Storage();
const bucket = storage.bucket(BUCKET_NAME);

// Serve local static files (dashboard, etc.) from public/
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', async (req, res) => {
  try {
    // Remove leading slash and default to index.html for root
    let filePath = req.path === '/' ? 'index.html' : req.path.slice(1);
    
    const file = bucket.file(filePath);
    const [exists] = await file.exists();
    
    if (!exists) {
      return res.status(404).send('File not found');
    }
    
    const stream = file.createReadStream();
    stream.pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`RedClover Capital website running on port ${PORT}`);
});