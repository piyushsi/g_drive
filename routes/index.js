var express = require("express");
var router = express.Router();

var hash = 'bundle.27cb113af19672da125c';

/* GET home page. */
router.get("*", function (req, res, next) {
  const cssPath =
    process.env.NODE_ENV == "production"
      ? `dist/bundle/${hash}.css`
      : "/static/bundle.css";
  const jsPath =
    process.env.NODE_ENV == "production"
      ? `dist/bundle/${hash}.js`
      : "/static/bundle.js";
  res.render("index", { title: "G Drive", jsPath, cssPath });
});

module.exports = router;