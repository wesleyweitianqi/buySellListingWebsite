// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cookieSession({
  name:'session',
  keys:['wesley', 'david']
}));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const listingsRoutes = require("./routes/listings");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/listings", listingsRoutes(db));
app.use("/", usersRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// app.get("/listings", (req, res) => {
//   const queryString = `
//   SELECT *
//   FROM listings
//   `;
//   return db.query(queryString)
//   .then(data => {
//     const templateVars = {
//       listings: data.rows
//     };
//     return res.render("listings", templateVars);
//   })
//   .catch(err => {
//     return console.log(err.stack);
//   });
// });

app.get("/", (req, res) => {
  if (req.session.user_id) {
    db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
      const templateVars = {user_id: req.session.user_id, username: result.rows[0].name, id: result.rows[0].name};
      res.render('index', templateVars);
      return res.redirect('/');
    }).catch(err => console.error(err));
  } else {
    res.render("index", {user_id: '', id: ''});
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
