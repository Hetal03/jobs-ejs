const authMiddleware = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You can't access that page before logon.");
    res.redirect("/");
  } else {
    next();
  }
};


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("errors", "You must be logged in.");
  res.redirect("/sessions/logon");
};

module.exports = {
  authMiddleware,
  isLoggedIn,
};