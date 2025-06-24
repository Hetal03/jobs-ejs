// routes/comments.js
const express = require("express");
const router = express.Router();
//const auth = require("../middleware/auth");
const { isLoggedIn } = require("../middleware/auth");

const commentController = require("../controllers/comments");

//router.post("/add/:id", auth, commentController.addComment);

router.post("/add/:id", isLoggedIn, commentController.addComment);


module.exports = router;
