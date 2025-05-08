const users = [];

function findUser(email) {
  return users.find(u => u.email === email);
}

function addUser(user) {
  users.push(user);
}

function authenticate(email, password) {
  return users.find(u => u.email === email && u.password === password);
}

export { users, findUser, addUser, authenticate };
