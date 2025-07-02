require("dotenv").config(); // Load environment variables

let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV === "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}
const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");
require("express-async-errors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const jobsRouter = require("./routes/jobs");
const lessonsRouter = require("./routes/lessons");

const { isLoggedIn } = require("./middleware/auth");

const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();

const SESSION_SECRET = process.env.SESSION_SECRET || "mydefaultsecret";

// Middleware: cookie parser (MUST come first)
app.use(cookieParser(SESSION_SECRET));

// Middleware: body parsers
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

// ✅ CSRF middleware config and application (🆕)
let csrf_development_mode = true;
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1);
}

const csrf_options = {
  development_mode: csrf_development_mode,
  protected_operations: ["POST", "PATCH"],
  protected_content_types: ["application/x-www-form-urlencoded", "application/json"],
};



app.use(require("body-parser").urlencoded({ extended: false }));
app.use(require("body-parser").json());

const csrf_middleware = csrf(csrf_options);


// ✅ Attach CSRF middleware + token setup (🆕)
app.use((req, res, next) => {
  csrf_middleware(req, res, (err) => {
    if (err) {
      console.error("CSRF error:", err.message);
      return res.status(403).send("Forbidden: CSRF token invalid or missing.");
    }
    res.locals._csrf = csrf.token(req, res); // Attach token for use in views
    next();
  });
});

// EJS view engine setup
app.set("view engine", "ejs");
//app.use(require("body-parser").urlencoded({ extended: true }));



// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
     // mongoUrl: process.env.MONGO_URI,
       mongoUrl: mongoURL,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(flash());

// Locals middleware
app.use(require("./middleware/storeLocals"));


// Passport setup
const passport = require("passport");
const passportInit = require("./passport/passportInit");
passportInit();
app.use(passport.initialize());
app.use(passport.session());

// ✅ Removed incorrect _csrf line here (🧹)
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


// Set content-type header manually for rendered pages and JSON
app.use((req, res, next) => {
  if (req.path === "/multiply") {
    res.set("Content-Type", "application/json");
  } else {
    res.set("Content-Type", "text/html");
  }
  next();
});




// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));

//const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");
//app.use("/secretWord", auth, secretWordRouter);
app.use("/secretWord", isLoggedIn, secretWordRouter);


 //const { isLoggedIn } = require("./middleware/auth");
 app.use("/lessons", isLoggedIn, lessonsRouter);
 app.use("/secretWord", isLoggedIn, secretWordRouter);
 app.use("/jobs", isLoggedIn, jobsRouter);


//const lessonsRouter = require("./routes/lessons");
//app.use("/lessons", auth, lessonsRouter);
app.use("/lessons", isLoggedIn, lessonsRouter);

app.use("/comments", require("./routes/comments"));

//app.use("/jobs", auth, jobsRouter);

//app.use("/jobs", auth, jobsRouter);



app.use(helmet());
app.use(xss());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));


app.get("/multiply", (req, res) => {
  const first = Number(req.query.first);
  const second = Number(req.query.second);
  let result = first * second;

  if (Number.isNaN(result)) {
    result = "NaN";
  } else if (result == null) {
    result = "null";
  }

  res.json({ result });
});




// 404 handler
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

// Start server


const port = process.env.PORT || 3000;

/*let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV === "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}
*/
const start = () => {
  try {
    require("./db/connect")(mongoURL); // no await here – synchronous version
    return app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

// 🧪 Export app for testing
module.exports = { app };

/*
const port = process.env.PORT || 3000;

const start = async () => {
  try {
   // await require("./db/connect")(process.env.MONGO_URI);
   let mongoURL = process.env.MONGO_URI;
   if (process.env.NODE_ENV === "test") {
   mongoURL = process.env.MONGO_URI_TEST;
   }
await require("./db/connect")(mongoURL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
*/