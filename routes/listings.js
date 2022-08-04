const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  //create - post
  router.post('/',(req,res) => {
    console.log(req.body)
    // db.query('SELECT * FROM users where id = $1;', [req.session.user_id]).then(result => {
      // res.render('post', {user_id: req.session.user_id, id: result.rows[0].name, username: result.rows[0].name });
      const text = "INSERT INTO listings (user_id, brand, model, year, description, price, is_sold, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
      const params = [req.session.user_id, req.body.brand, req.body.model, req.body.year, req.body.description, req.body.price, false, req.body.photo_url];
      console.log(params);
      db.query(text, params).then(() => {
        res.redirect('/listings/new')
      }).catch(err =>console.error(err));
    // }).catch(err => console.error(err));

  });

  //read all - get
  router.get('/', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
        const templateVars = {user_id: req.session.user_id, id: result.rows[0].name, username: result.rows[0].name }
        db.query('SELECT * FROM listings ORDER BY time_created DESC LIMIT 10;').then(result => {
          const listings = result.rows;
          res.send(listings);
        }).catch(err => console.error(err));
      }).catch(err => console.error(err));
    } else {
      res.redirect('/login');
    }
  });

  //read all from user - get
  router.get('/me', (req,res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
        const templateVars = {user_id: req.session.user_id, id: result.rows[0].name, username: result.rows[0].name }
        db.query('SELECT * FROM listings WHERE user_id =$1 ORDER BY time_created DESC LIMIT 10;',[req.session.user_id]).then(result => {
          const listings = result.rows;
          res.send(listings);
        }).catch(err => console.error(err));
      }).catch(err => console.error(err));
    }
  });

        //read all from another specific user - get
  router.get('/others/:user_id', (req,res) => {
    if (req.session.user_id) {
      db.query('√ WHERE id = $1;', [req.session.user_id]).then(result => {
        const templateVars = {user_id: req.session.user_id, id: result.rows[0].name, username: result.rows[0].name }
        db.query('SELECT * FROM listings WHERE user_id = $1 ORDER BY time_created DESC LIMIT 10;',[req.params.user_id]).then(result => {
          const listings = result.rows;
          res.send(listings);
        }).catch(err => console.error(err));
      }).catch(err => console.error(err));
    }
  });

  router.get('/favourite', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM listings JOIN favourite_items ON listings.user_id = favourite_items.user_id where favourite_items.user_id = $1', [req.session.user_id]).then(result => {
        return res.send(result.rows);
      }).catch(err => console.error(err));
    }

  })

  router.post('/delete', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM listings JOIN favourite_items ON listings.user_id = favourite_items.user_id where favourite_items.user_id = $1', [req.session.user_id]).then(result => {
        return res.send(result.rows);
      }).catch(err => console.error(err));
    }
  })

  return router;
};
