const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require("bcrypt");
const app = express();
app.use(cookieSession({
  name: "session",
  keys: ["dogWithABone"]
}));
const PORT = 8080; // default port 8080

// Users object
const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: bcrypt.hashSync("1234", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("5678", 10)
  }
};

// Generate random string
function generateRandomString() {
  let result = '';
  let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += char.charAt(Math.floor(Math.random() * char.length));
  }
  return result;
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");

// URL database
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lW"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "637hy2"
  }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// HOME page
app.get("/urls", (req, res) => {
  let templateVars = {
    // email: users[req.cookies["userID"]]["email"],
    urls: urlDatabase,
    userID: users[req.session["userID"]]
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    "longURL": req.body.longURL,
    "userID": req.session["userID"]
  };
  res.redirect("/urls");
});

// NEW urls
app.get("/urls/new", (req, res) => {
  let templateVars = {
    userID: users[req.session["userID"]]
  };
  if (!req.session["userID"]) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL
  let longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    userID: users[req.session["userID"]],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  }
  res.render("urls_show", templateVars)
})

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// DELETE
app.post("/urls/:url/delete", (req, res) => {
  let user = req.session["userID"];
  if (user) {
    if (users[user]["id"] === urlDatabase[req.params.url]["userID"]) {
      let url = req.params.url;
      delete urlDatabase[url];
      res.redirect("/urls");
    }
  }
  res.redirect("/login");
});

// EDIT
app.post("/urls/:url/edit", (req, res) => {
  let user = req.session["userID"];
  if (user) {
    if (users[user]["id"] === urlDatabase[req.params.url]["userID"]) {
      let url = req.params.url;
      urlDatabase[url].longURL = req.body.longURL;
      res.redirect("/urls");
    }
  }
  res.redirect("/login");
});

// LOGINS
app.get("/login", (req, res) => {
  let templateVars = {
    userID: users[req.session["userID"]],
  }
  res.render("urls_login", templateVars);
})

app.post("/login", (req, res) => {
  const user = getUser(req.body.email, req.body.password);
  if (!user) {
    return res.send("403 Invalid Email or Password");
  }
  req.session["UserID"] = user;
  console.log("POOOOOOOOOOOOOP");
  res.redirect("/urls");
});

// Function to check email and passwords together
const getUser = function (email, inputPassword) {
  for (let uid in users) {
    const user = users[uid];
    if (user.email === email && bcrypt.compareSync(inputPassword, user.password)) {
      return user;
    }
  }
  return null;
};

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  let templateVars = {
    userID: req.session["userID"]
  };
  res.render("urls_registration", templateVars);
});

// Register a user or register errors
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.send("400 Bad Request");
    return;
  }
  let usedEmail = checkEmailUsers(req.body.email, users);
  if (usedEmail) {
    res.send("400 Bad Request");
    return;
  }
  const newUserID = generateRandomString();
  users[newUserID] = {
    id: newUserID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  req.session["userID"] = newUserID;
  res.redirect("/urls");
});

// Function to check email users
const checkEmailUsers = function (email, users) {
  for (user in users) {
    let databaseEmail = users[user]["email"]
    if (databaseEmail === email) {
      return user;
    }
  }
  return false;
};
checkEmailUsers();

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});