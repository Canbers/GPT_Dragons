const express = require('express');
const router = express.Router();

// Example route
router.get('/example', (req, res) => {
  res.json({ message: 'Hello from API route!' });
});

module.exports = router;
