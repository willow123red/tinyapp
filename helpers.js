// Function to check email users are in database
const checkEmailUsers = function(email, users) {
  for (let user in users) {
    let databaseEmail = users[user]["email"];
    if (databaseEmail === email) {
      return user;
    }
  }
  return undefined;
};

// Generate random string
const generateRandomString = function() {
  let result = '';
  let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += char.charAt(Math.floor(Math.random() * char.length));
  }
  return result;
};

module.exports = {
  checkEmailUsers,
  generateRandomString,
};