/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcryptjs')


module.exports = (db) => {
  //visit login page
  router.get("/login", (req, res) => {
    if(req.session.user_id) {
      return res.redirect('/listings')
    }
    res.render('login')
  });
  //post login page
  router.post("/login", (req, res) => {
    const { email , password} = req.body;
    db.query('SELECT * FROM users WHERE email = $1;',[email]).then(result => {
      if (bcrypt.compareSync(password, result.rows[0].password)) {
        req.session.user_id = result.rows[0].id;
        console.log('password:',result.rows[0]);
        res.redirect('/listings');
      }
    }).catch(err => console.error(err));
  });

  router.get('/logout', (req,res) => {
    req.session = null;
    res.redirect('/login');
  })

  router.get('/register', (req,res) => {
    if (req.session.user_id) {
      return res.redirect('/listings');
    }
    res.render('register');
  })

  router.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    console.log('req.body', name, email, password);
    const text ='SELECT * FROM users WHERE email = $1';
    const params = [email];
    db.query(text, params).then(result => {
      // console.log(result.rows);
      if (result.rows.length === 0) {
        db.query('INSERT INTO users(name, email,password) VALUES($1,$2,$3)', [name, email, `${bcrypt.hashSync(password,10)}`]).then(() => {
          db.query(text, params).then(result => {
            req.session.user_id = result.rows[0].id;
            return res.redirect('/listings');
          })
        })
      } else {
        db.query(text,params).then(result => {
          if (result.rows[0].email === email) {
            return res.redirect('/login');
          }
        })
        res.render('listings');
      }
    }).catch(err => console.error(err));
  });

  router.get('/listings', (req, res) => {
    if (req.session.user_id) {
    }
    res.render('listings');
  })
  return router;
};
