// Function to check email users
const checkEmailUsers = function (email, users) {
  for (user in users) {
    let databaseEmail = users[user]["email"]
    if (databaseEmail === email) {
      return user;
    }
  }
  return undefined;
};

module.exports = { checkEmailUsers };