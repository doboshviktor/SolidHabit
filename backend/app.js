const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());

const users = require('./constants/users');
const habits = require('./constants/habits');
const marketplaceItems = require('./constants/marketplaceItems');
const habitsHistory = require('./constants/habitsHistory');
const proofRequests = require('./constants/proofRequests');

const historyFilePath = path.join(__dirname, 'constants', 'habitsHistory.js');

function saveHistoryToFile() {
  const fileContent = `// Історія виконання звичок по датах\nmodule.exports = ${JSON.stringify(habitsHistory, null, 2)};\n`;
  fs.writeFile(historyFilePath, fileContent, (err) => {
    if (err) console.error('Error saving history to file:', err);
  });
}

app.post('/api/auth/login', jsonParser, (req, res) => {
  const { name, password } = req.body;
  const user = users.find((u) => u.name === name && u.password === password);

  if (user) {
    const userSafe = { ...user };
    delete userSafe.password;
    res.json({ success: true, user: userSafe });
  } else {
    res.status(401).json({ success: false, message: 'Invalid name or password' });
  }
});

app.get('/api/users', (req, res) => {
  const safeUsers = users.map((u) => {
    const userSafe = { ...u };
    delete userSafe.password;
    return userSafe;
  });
  res.json(safeUsers);
});

app.get('/api/users/:id', (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (user) {
    const userSafe = { ...user };
    delete userSafe.password;
    res.json(userSafe);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.get('/api/users/:id/history', (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userHistory = habitsHistory.map((item, index) => {
    const variation = (userId * 17 + index * 7) % 5;
    const completed = Math.max(1, Math.min(item.totalCount || 7, ((item.completedCount + variation) % (item.totalCount || 7)) + 1));
    const total = item.totalCount || 7;
    return {
      date: item.date,
      completedCount: completed,
      totalCount: total,
      percentage: Math.round((completed / total) * 100),
    };
  });

  res.json(userHistory);
});

app.get('/api/habits', (req, res) => {
  res.json(habits);
});

app.get('/api/habits/history', (req, res) => {
  res.json(habitsHistory);
});

app.post('/api/habits/history', jsonParser, (req, res) => {
  const { date, completedCount, totalCount } = req.body;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const existingIndex = habitsHistory.findIndex((h) => h.date === date);

  const entry = { date, completedCount, totalCount, percentage };
  if (existingIndex >= 0) {
    habitsHistory[existingIndex] = entry;
  } else {
    habitsHistory.push(entry);
  }

  saveHistoryToFile();
  res.json(entry);
});

app.get('/api/marketplace', (req, res) => {
  res.json(marketplaceItems);
});

app.post('/api/marketplace/add', jsonParser, (req, res) => {
  const newItem = {
    id: Date.now(),
    ownerId: Number(req.body.ownerId),
    title: req.body.title || 'New Item',
    price: Number(req.body.price) || 100,
    description: req.body.description || '',
  };
  marketplaceItems.push(newItem);
  res.json(newItem);
});

app.get('/api/proofs', (req, res) => {
  res.json(proofRequests);
});

app.post('/api/proofs/request', jsonParser, (req, res) => {
  const { fromUserId, fromUserName, toUserId, habitTitle } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  const newRequest = {
    id: Date.now(),
    fromUserId: Number(fromUserId),
    fromUserName: fromUserName || 'Friend',
    toUserId: Number(toUserId),
    habitTitle: habitTitle || 'Daily Habits',
    date: today,
    status: 'pending',
    proofText: '',
  };

  proofRequests.push(newRequest);
  res.json(newRequest);
});

app.post('/api/proofs/respond', jsonParser, (req, res) => {
  const { requestId, proofText, status } = req.body;
  const target = proofRequests.find((p) => p.id === Number(requestId));

  if (target) {
    target.proofText = proofText || '';
    target.status = status || 'approved';
    res.json(target);
  } else {
    res.status(404).json({ message: 'Request not found' });
  }
});

module.exports = app;
