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

module.exports = {
  checkEmailUsers,
};