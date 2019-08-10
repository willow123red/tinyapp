const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const PORT = 8080; // default port 8080

// Users object
const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "1234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// Generate random string
function generateRandomString() {
  let result = ' ';
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    // email: users[req.cookies["userID"]]["email"],
    urls: urlDatabase,
    userID: users[req.cookies["userID"]]
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    "longURL": req.body.longURL,
    "userID": req.cookies["userID"]
  };
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    userID: users[req.cookies["userID"]]
  };
  if (!req.cookies["userID"]) {
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
    userID: users[req.cookies["userID"]],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  }
  res.render("urls_show", templateVars)
})

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// DELETE
app.post("/urls/:url/delete", (req, res) => {
  let user = req.cookies["userId"];
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
  let user = req.cookies["userID"];
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
    userID: users[req.cookies["userID"]],
  }
  res.render("urls_login", templateVars);
})

app.post("/login", (req, res) => {
  const user = getUser(req.body.email, req.body.password);
  if (!user) {
    return res.send("403 Invalid Email or Password");
  }
  res.cookie("userID", user.id);
  res.redirect("/urls");
});

// Function to check email and passwords together
const getUser = function (email, password) {
  for (userID in users) {
    const user = users[userID];
    if (user.email === email && user.password === password) {
      return user;
    }
  }
  return null;
};

app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  let templateVars = {
    userID: req.cookies["userID"]
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
  let newUserID = generateRandomString();
  res.cookie("userID", newUserID);
  users[newUserID] = {
    id: newUserID,
    email: req.body.email,
    password: req.body.password
  };
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