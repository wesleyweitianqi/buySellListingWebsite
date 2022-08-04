/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
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

      //visit login page
      router.get("/login", (req, res) => {
        if(req.session.user_id) {
          return res.redirect('/');
        }
        res.render('login', {user_id : '', id :''})
      });

      router.get('/register', (req,res) => {
        res.render('register', {user_id : '',id : ''});
      })

    router.get('/register', (req,res) => {
      res.render('register', {user_id : '',id : ''});
    })

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

    router.get('/listings/new', (req, res) => {
      if (req.session.user_id) {
        db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
          const templateVars = {user_id: req.session.user_id, username: result.rows[0].name, id: result.rows[0].name };
            res.render('post', templateVars);
        }).catch(err => console.error(err));
      } else {
      res.render("post", {user_id: '', id: ''});
      }
    });

    router.get('/search', (req,res) => {
      if (req.session.user_id) {
        db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
          const templateVars = {user_id: result.rows[0].id, username: result.rows[0].name, id: result.rows[0].name };
            res.render('search', templateVars);
        }).catch(err => console.error(err));
      } else {
      res.render("search", {user_id: null, id: null});
      }
    });

    router.get('/users/:user_id', (req, res) => {
      if (req.session.user_id) {
        db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
          const templateVars = {
            user_id: req.session.user_id,
            id: result.rows[0].name,
            username: result.rows[0].name,
            other_user_id: req.params.user_id
          }
          res.render('others', templateVars);
        }).catch(err => console.error(err));
      } else {
        res.redirect('/login');
      }
    });

  return router;

};
