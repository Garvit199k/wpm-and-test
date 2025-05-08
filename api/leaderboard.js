let leaderboard = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, mode, wpm, date } = req.body;
    if (!username || !mode || !wpm || !date) {
      res.status(400).json({ error: 'Missing score data' });
      return;
    }
    leaderboard.push({ username, mode, wpm, date });
    // Keep leaderboard sorted by wpm descending and limit to top 10
    leaderboard.sort((a, b) => b.wpm - a.wpm);
    if (leaderboard.length > 10) {
      leaderboard = leaderboard.slice(0, 10);
    }
    res.status(201).json({ message: 'Score added' });
  } else if (req.method === 'GET') {
    res.status(200).json(leaderboard);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
