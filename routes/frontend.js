/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const queryText = require('./helper')

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
        const templateVars = {user_id: req.session.user_id, username: result.rows[0].name, id: result.rows[0].name};
        res.render('index', templateVars);
        return res.redirect('/');
      }).catch(err => console.error(err));
    } else {
      res.render("index", {user_id: null, username: null, id: null});
    }
  });

      //visit login page
      router.get("/login", (req, res) => {
        if(req.session.user_id) {
          return res.redirect('/');
        }
        res.render('login', {user_id : null, id :null})
      });

      router.get('/register', (req,res) => {
        res.render('register', {user_id: null, id: null});
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
      res.render("post", {user_id: null, id: null});
      }
    });

      //insert post to database
  router.post('/listings/new',(req,res) => {
    const text = "INSERT INTO listings (user_id, brand, model, year, description, price, is_sold, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const params = [req.session.user_id, req.body.brand, req.body.model, req.body.year, req.body.description, req.body.price, false, req.body.photo_url];
    db.query(text, params).then(() => {
      res.redirect('/listings/new')
    })
    .catch(err =>console.error(err));
  });


  router.get('/favourite', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
        const templateVars = {user_id: req.session.user_id, username: result.rows[0].name, id: result.rows[0].name };
        res.render('favourite', templateVars);
      }).catch(err => console.error(err));
    } else {
      res.redirect('/login');
    }
  });

  router.post('/api/listings/favourite', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM favourite_items WHERE user_id = $1 AND listing_id = $2;', [req.session.user_id, req.body.listing_id]).then(result => {
        if (result.rows.length === 0) {
          db.query('INSERT INTO favourite_items (user_id, listing_id) VALUES ($1, $2);', [req.session.user_id, req.body.listing_id]).then(result => {
            res.send(result);
          });
        } else {
          db.query('DELETE FROM favourite_items WHERE user_id = $1 AND listing_id = $2;', [req.session.user_id, req.body.listing_id]).then(result => {
            res.send(result);
          })
        }
      })
      // Select user_id and listing_id see if it exists
        // if exists, delete from database,
        // if does not insert into database.
    }
  });

  router.get('/search', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
        const templateVars = { user_id: req.session.user_id, username: result.rows[0].name, id: result.rows[0].id };
        res.render('search', templateVars);
      });
    }
  });

  router.get('/search/api', (req,res) => {
    db.query(queryText(req.body)[0], queryText(req.body)[1]).then(result => {
      return res.send(result.rows[0]);
    })
  })

  return router;

};
