router.get("/", (req, res) => {
  res.render("home"); // since res.locals.user is already set, no need to pass explicitly
});
