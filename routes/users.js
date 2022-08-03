/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcryptjs')
// const createListing = require('../public/scripts/app.js');

module.exports = (db) => {
  //route to handle register data
  router.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const text ='SELECT * FROM users WHERE email = $1';
    const params = [email];
    db.query(text, params).then(result => {
      if (result.rows.length === 0) {
        db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, `${bcrypt.hashSync(password,10)}`]).then(() => {
          db.query(text, params).then(result => {
            req.session.user_id = result.rows[0].id;
            return res.redirect('/');
          })
        })
      } else {
        db.query(text,params).then(result => {
          if (result.rows[0].email === email) {
            return res.redirect('/login');
          }
        });
      }
    }).catch(err => console.error(err));
  });

  //route to handle login data
  router.post("/login", (req, res) => {
    const { email , password} = req.body;
    db.query('SELECT * FROM users WHERE email = $1;',[email]).then(result => {
      if (result.rows.length === 0) {
        return res.redirect('/register');
      }
      if (bcrypt.compareSync(password, result.rows[0].password)) {
        req.session.user_id = result.rows[0].id;
        return res.redirect('/');
      } else {
        res.send('Password is not correct')
      }
    }).catch(err => console.error(err));
  });

  //route to remove credentials data;
  router.post('/logout', (req,res) => {
    req.session = null;
    res.redirect('/login');
  });

  return router;

};
