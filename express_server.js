const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const PORT = 8080; // default port 8080

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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    email: users[req.cookies["userID"]]["email"],
    urls: urlDatabase,
    userID: users[req.cookies["userID"]]
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let newRandomGeneratedString = generateRandomString();
  urlDatabase[newRandomGeneratedString] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    userID: users[req.cookies["userID"]]
  };
  res.render("urls_new", templateVars);
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

app.post("/urls/:url/delete", (req, res) => {
  let url = req.params.url;
  delete urlDatabase[url];
  res.redirect("/urls");
});

app.post("/urls/:url/edit", (req, res) => {
  let url = req.params.url;
  urlDatabase[url] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  let templateVars = {
    
  }
})

app.post("/login", (req, res) => {
  res.cookie("userID", req.body.userID);
  console.log(req.body.userID);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/urls");
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
  console.log("poopy poop")
  res.redirect("/urls");
});

// Function to check email users
const checkEmailUsers = function (email, users) {
  for (user in users) {
    let databaseEmail = users[user]["email"]
    if (databaseEmail === email) {
      return true;
    }
  }
};
checkEmailUsers();

// Users object
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}
