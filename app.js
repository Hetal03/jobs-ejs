require("dotenv").config(); // Load environment variables
const express = require("express");
require("express-async-errors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const app = express();

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

// Use sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(flash());

// ✅ Use only this for setting flash messages in locals
app.use(require("./middleware/storeLocals"));

const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit(); // Initialize passport strategies
app.use(passport.initialize());
app.use(passport.session());


// Make req.user available in all templates as 'user'
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});





app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));


/*
// ✅ secretWord handling
app.get("/secretWord", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  res.render("secretWord", { secretWord: req.session.secretWord });
});

app.post("/secretWord", (req, res) => {
  const word = req.body.secretWord?.trim();

  if (word && word[0].toUpperCase() === "P") {
    req.flash("error", "Words that start with 'P' are not allowed.");
  } else if (word) {
    req.session.secretWord = word;
    req.flash("info", "The secret word was changed.");
  } else {
    req.flash("error", "Please enter a valid secret word.");
  }

  res.redirect("/secretWord");
});  */

const auth = require("./middleware/auth"); 
const secretWordRouter = require("./routes/secretWord");

app.use("/secretWord", auth, secretWordRouter); 


// 404 handler
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
