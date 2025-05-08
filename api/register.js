import { findUser, addUser } from './users.js';

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
  if (findUser(username)) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }
  addUser({ username, password });
  res.status(201).json({ message: 'User registered successfully' });
}
