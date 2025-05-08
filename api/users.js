const users = [];

function findUser(username) {
  return users.find(u => u.username === username);
}

function addUser(user) {
  users.push(user);
}

function authenticate(username, password) {
  return users.find(u => u.username === username && u.password === password);
}

export { users, findUser, addUser, authenticate };
