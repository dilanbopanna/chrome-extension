const express = require('express');
const cors = require('cors'); // Import the CORS package
const app = express();
const port = 9001; // Ensure you're using the correct port

app.use(cors()); // Enable CORS for all routes (you can customize this if needed)
app.use(express.json());

// Array to store copied data
const copiedData = [];

// POST API to save copied content
app.post('/api/save-copy', (req, res) => {
  const copiedContent = req.body.copiedContent;

  if (!copiedContent) {
    return res
      .status(400)
      .json({ status: 'error', message: 'No content provided' });
  }

  const timestamp = new Date().toISOString();
  const newEntry = {
    id: copiedData.length + 1, // Auto-incremental ID
    data: copiedContent,
    timestamp: timestamp,
  };

  copiedData.push(newEntry);

  console.log('Received content:', newEntry);
  res.json({ status: 'success', message: 'Content saved', entry: newEntry });
});

// GET API to fetch all data
app.get('/api/all-copies', (req, res) => {
  if (copiedData.length === 0) {
    return res.json({
      status: 'success',
      message: 'No data available',
      data: [],
    });
  }

  res.json({
    status: 'success',
    message: 'All data retrieved',
    data: copiedData,
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log(`Accessible on this machine at http://localhost:${port}`);
});
