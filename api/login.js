import { authenticate } from './users.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password required' });
    return;
  }
  const user = authenticate(username, password);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  res.status(200).json({ user: { username: user.username } });
}
