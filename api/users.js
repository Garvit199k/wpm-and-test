import fs from 'fs';
import path from 'path';

const usersFilePath = path.resolve('./api/users.json');

function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

function findUser(username) {
  const users = readUsers();
  return users.find(u => u.username === username);
}

function addUser(user) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

function authenticate(username, password) {
  const users = readUsers();
  return users.find(u => u.username === username && u.password === password);
}

export { findUser, addUser, authenticate };
