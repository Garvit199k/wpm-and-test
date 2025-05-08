import { authenticate } from './users.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }
  const user = authenticate(email, password);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  res.status(200).json({ user: { email: user.email } });
}
