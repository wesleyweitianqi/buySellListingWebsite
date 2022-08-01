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
    res.render('login');
  })

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    db
      .query('SELECT * FROM users WHERE users.email = $1 AND users.password = $2;', [email, password])
      .then((result) => {
        console.log(result.rows[0])
        if (result.rows[0].email === email && result.rows[0].password === password) {
          const users = result.rows[0];
          res.redirect('/');
          return result.rows[0];
        }
      })
      .catch((err) => {
        console.log(err.message);
        res.send(err.message);
      });
  });
  return router;
};


