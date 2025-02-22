const express = require('express');
const router = express.Router();
const GoogleDocsLoader = require('../../../server/utils/extensions/GoogleDocs/index');

router.get('/auth/status', async (req, res) => {
  try {
    const loader = new GoogleDocsLoader();
    const status = await loader.checkAuth();
    res.json(status);
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ error: 'Failed to check authorization status' });
  }
});

router.get('/auth/url', (req, res) => {
  try {
    const { url } = GoogleDocsLoader.getAuthUrl();
    res.json({ url });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const result = await GoogleDocsLoader.handleCallback(code);
    if (result.success) {
      res.redirect('/workspace?auth=success');
    } else {
      res.redirect('/workspace?auth=error');
    }
  } catch (error) {
    console.error('Error handling callback:', error);
    res.redirect('/workspace?auth=error');
  }
});

router.get('/list', async (req, res) => {
  try {
    const documents = await GoogleDocsLoader.listDocuments();
    res.json(documents);
  } catch (error) {
    console.error('Error listing documents:', error);
    res.status(500).json({ error: 'Failed to list documents' });
  }
});

router.post('/collect', async (req, res) => {
  const { documentIds } = req.body;
  if (!documentIds || !Array.isArray(documentIds)) {
    return res.status(400).json({ error: 'Document IDs array is required' });
  }

  try {
    const result = await GoogleDocsLoader.collect(documentIds);
    res.json(result);
  } catch (error) {
    console.error('Error collecting documents:', error);
    res.status(500).json({ error: 'Failed to collect documents' });
  }
});

module.exports = router; 