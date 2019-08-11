const {
  assert
} = require('chai');

const {
  checkEmailUsers
} = require('../helpers.js');

const testUsers = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "1234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "5678"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = checkEmailUsers("user@example.com", testUsers);
    const expectedOutput = "aJ48lW";
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });

  it('should return undefined if user not valid', function() {
    const user = checkEmailUsers("humptydumpty@wall.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});