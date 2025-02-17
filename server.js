const express = require('express');
const cors = require('cors');
const app = express();
const port = 9001;

app.use(cors());
app.use(express.json());

// Object to store copied data per user
const userCopiedData = {};

// POST API to save copied content
app.post('/api/save-copy', (req, res) => {
  const { username, copiedContent } = req.body;

  if (!username || !copiedContent) {
    return res.status(400).json({
      status: 'error',
      message: 'Username and content are required',
    });
  }

  if (!userCopiedData[username]) {
    userCopiedData[username] = [];
  }

  const timestamp = new Date().toISOString();
  const newEntry = {
    id: userCopiedData[username].length + 1, // Auto-incremental ID
    data: copiedContent,
    timestamp,
  };

  // Ensure no more than 100 items for a user
  if (userCopiedData[username].length >= 100) {
    // Remove the oldest content (first item)
    userCopiedData[username].shift();
  }

  // Add the new content
  userCopiedData[username].push(newEntry);

  console.log(userCopiedData);
  console.log(`Content saved for user: ${username}`, newEntry);
  res.json({
    status: 'success',
    message: 'Content saved',
    entry: newEntry,
  });
});

// GET API to fetch all copies for a user
app.get('/api/all-copies', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      status: 'error',
      message: 'Username is required',
    });
  }

  const userData = userCopiedData[username] || [];

  res.json({
    status: 'success',
    message: userData.length > 0 ? 'Data retrieved' : 'No data available',
    data: userData,
  });
});

// GET API to check if a username exists
app.get('/api/check-username', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      status: 'error',
      message: 'Username is required',
    });
  }

  const exists = !!userCopiedData[username];

  res.json({
    status: 'success',
    message: exists ? 'Username exists' : 'Username not found',
    exists,
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log(`Accessible on this machine at http://localhost:${port}`);
});
