const express = require('express');
const router  = express.Router();
const queryText = require('./helper')


module.exports = (db) => {

//create all listings API
  router.get('/', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(results => {
        db.query('SELECT * FROM listings ORDER BY time_created DESC')
        .then(result => {
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
        db.query('SELECT * FROM listings WHERE user_id = $1 ORDER BY time_created DESC LIMIT 10;',[req.session.user_id]).then(result => {
          const listings = result.rows;
          res.send(listings);
        }).catch(err => console.error(err));
      }).catch(err => console.error(err));
    }
  });

  //create favourite API
  router.get('/favourite', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM listings JOIN favourite_items ON listings.user_id = favourite_items.user_id where favourite_items.user_id = $1', [req.session.user_id]).then(result => {
        return res.send(result.rows);
      }).catch(err => console.error(err));
    }
  })

  router.post('/search', (req, res) => {
    console.log('+++++++++++++++', req.body);
    const queryObj = queryText(req.body);
    if (!queryObj || queryObj.length < 2) {
      return res.send('wrong');
    }
    const queryString = queryObj[0];
    const queryParams = queryObj[1];
    console.log('+++++++++++++++', queryString, queryParams);
    if (req.session.user_id) {
      db.query(queryString, queryParams).then(result => {
        return res.send(result.rows);
      })
    }
  });

  //delete select items
  router.post('/delete', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM listings JOIN favourite_items ON listings.user_id = favourite_items.user_id where favourite_items.user_id = $1', [req.session.user_id]).then(result => {
        return res.send(result.rows);
      }).catch(err => console.error(err));
    }
  })


  return router;
};
