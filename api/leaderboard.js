import fs from 'fs';
import path from 'path';

const leaderboardFilePath = path.resolve('./api/leaderboard.json');

function readLeaderboard() {
  try {
    const data = fs.readFileSync(leaderboardFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeLeaderboard(entries) {
  fs.writeFileSync(leaderboardFilePath, JSON.stringify(entries, null, 2));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const entries = readLeaderboard();
    // Return top 10 sorted by WPM descending
    const top10 = entries.sort((a, b) => b.wpm - a.wpm).slice(0, 10);
    res.status(200).json(top10);
  } else if (req.method === 'POST') {
    const { username, mode, wpm, date } = req.body;
    if (!username || !mode || !wpm || !date) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }
    const entries = readLeaderboard();
    entries.push({ username, mode, wpm, date });
    writeLeaderboard(entries);
    res.status(201).json({ message: 'Score submitted' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
