import { findUser, addUser } from './users.js';

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
  if (findUser(email)) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }
  addUser({ email, password });
  res.status(201).json({ message: 'User registered successfully' });
}
