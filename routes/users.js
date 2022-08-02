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
  //visit login page
  router.get("/login", (req, res) => {
    if(req.session.user_id) {
      return res.redirect('/');
    }
    res.render('login', {user_id : '', id :''})
  });
  //post login page
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

  router.get('/logout', (req,res) => {
    req.session = null;
    res.redirect('/login');
  })

  router.get('/register', (req,res) => {
    res.render('register', {user_id : '',id : ''});
  })

  router.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    console.log('req.body', name, email, password);
    const text ='SELECT * FROM users WHERE email = $1';
    const params = [email];
    db.query(text, params).then(result => {
      if (result.rows.length === 0) {
        db.query('INSERT INTO users(name, email,password) VALUES($1,$2,$3)', [name, email, `${bcrypt.hashSync(password,10)}`]).then(() => {
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

  router.get('/listings', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
        const templateVars = {user_id: req.session.user_id, id: result.rows[0].name, username: result.rows[0].name }
        res.render('listings', templateVars);
      }).catch(err => console.error(err));
    } else {
      res.redirect('/login');
    }
  });

  router.get('/listings/api', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
        const templateVars = {user_id: req.session.user_id, id: result.rows[0].name, username: result.rows[0].name }
        db.query('SELECT * FROM listings LIMIT 10;').then(result => {
          const listings = result.rows;
          res.send(listings);
        }).catch(err => console.error(err));
      }).catch(err => console.error(err));
    } else {
      res.redirect('/login');
    }
    db.query('SELECT * FROM listings;').then(result => {
      const listings = result.rows;
    }).catch(err => console.error(err));
  });

  router.get('/:user_id', (req,res) => {
    // if (req.session.user_id) {
    //   return res/redirect('/');
    // }
    // if (req.params.id !== req.session.user_id) {
    //   return res.send('Page Not Found');
    // }
    if (req.session.user_id) {
      db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
        const templateVars = {user_id: req.session.user_id, username: result.rows[0].name, id: result.rows[0].name};
        res.render('post', templateVars);
        return res.redirect('/');
      }).catch(err => console.error(err));
    } else {
    res.render("post", {user_id: '', id: ''});
    }
  });

  router.post('/:user_id', (req, res) => {
    db.query('SELECT * FROM users where id = $1;', [res.session.user_id]).then(result => {
      res.render('post', {user_id : req.session.user_id, id : result.rows[0].name, username: result.rows[0].name });
    })
  })

  return router;

};
