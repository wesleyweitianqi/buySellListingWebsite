/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/login", (req, res) => {
    const templateVars = { user: req.session.user_id }
    if (templateVars.user) {
      res.redirect('/');
    }
    res.render('login', templateVars);
  })

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db
      .query('SELECT * FROM users WHERE users.email = $1 AND users.password = $2;', [email, password])
      .then((result) => {
        if (result.rows[0].email === email && result.rows[0].password === password) {
          req.session.user_id = result.rows[0].id;
          req.session.user = result.rows[0];
          console.log(req.session);
          res.redirect('/');
          return result.rows[0];
        }
      })
      .catch((err) => {
        console.log(err.message);
        res.send(err.message);
      });
  });

  router.get("/register", (req, res) => {
    res.render('register');
  })

  router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    db
      .query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [name, email, password])
      .then((result) => {
        if(!(result.rows[0].name || result.rows[0].email || result.rows[0].password)) {
          res.send("Please enter a valid input.");
        }
        console.log(result.rows[0].id);
        req.session.user = result.rows[0];
        req.session.user_id = result.rows[0].id;
        res.redirect('/');
        return result.rows[0];
      })
      .catch((err) => {
        console.log(err.message);
        res.send(err.message);
      });
  });

  router.post("/logout", (req, res) => {
    req.session.user = null;
    req.session.user_id = null;
    req.session = null;
    res.redirect("/");
  });

  return router;
};


