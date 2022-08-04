const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  const getAllListings = function (options, limit = 15) {

    const queryParams = [];

    let queryString = `SELECT * FROM listings `;

    if (Object.keys(options).length > 0) {
      if (options.minimum_price) {
        queryParams.push(`${options.minimum_price}`);
        queryString += `WHERE price > $${queryParams.length} `;
      }
      if (options.maximum_price) {
        queryParams.push(`${options.maximum_price}`);
        if (!options.minimum_price) {
          queryString += `WHERE price < $${queryParams.length} `;
        } else {
          queryString += `AND price < $${queryParams.length} `;
        }
      }
      if (options.brand) {
        queryParams.push(`%${options.brand}%`);
        if (!options.minimum_price && !options.maximum_price) {
          queryString += `WHERE brand LIKE $${queryParams.length} `;
        } else {
          queryString += `AND brand LIKE $${queryParams.length} `;
        }
      }
      if (options.model) {
        queryParams.push(`%${options.model}%`);
        if (!options.minimum_price && !options.maximum_price && !options.brand) {
          queryString += `WHERE model LIKE $${queryParams.length} `;
        } else {
          queryString += `AND model LIKE $${queryParams.length} `;
        }
      }
      if (options.year) {
        queryParams.push(`${options.year}`);
        if (!options.minimum_price && !options.maximum_price && !options.brand && !options.model) {
          queryString += `WHERE year = $${queryParams.length} `;
        } else {
          queryString += `AND year = $${queryParams.length} `;
        }
      }
    }

    queryParams.push(limit);
    queryString += `
    GROUP BY id
    ORDER BY price
    LIMIT $${queryParams.length};
    `;

    return db.query(queryString, queryParams)
      .then((result) => {
        return result.rows;
      });
  };

  //--------------------------------function--------------
  //insert post to database
  // router.post('/',(req,res) => {
  //   console.log('postData:', req.body);
  //   const text = "INSERT INTO listings (user_id, brand, model, year, description, price, is_sold, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
  //   const params = [req.session.user_id, req.body.brand, req.body.model, req.body.year, req.body.description, req.body.price, false, req.body.photo_url];
  //   db.query(text, params)
  //   .catch(err =>console.error(err));
  // });

  //read all - get

  // router.get('/search', (req, res) => {
  //   if (req.session.user_id) {
  //     db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(result => {
  //       getAllListings(req.body, 15)
  //       .then(result => {
  //         console.log(result)
  //         res.send(result);
  //         return res.redirect('/search');
  //       }).catch(err => console.error(err));
  //     }).catch(err => console.error(err));
  //   }
  // });

  router.get('/', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(results => {
        getAllListings(req.body, 15)
        .then(result => {
          const listings = result;
          res.send(listings);
        }).catch(err => console.error(err));
      }).catch(err => console.error(err));
    } else {
      res.redirect('/login');
    }
  });

  // router.get('/search', (req, res) => {
  //   if (req.session.user_id) {
  //     const data = getAllListings(req.body, 15);
  //     db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then(results => {

  //     });
  //   }
  // });

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

        //read all from another specific user - get
  // router.get('/others/:user_id', (req,res) => {
  //   if (req.session.user_id) {
  //     db.query('√ WHERE id = $1;', [req.session.user_id]).then(result => {
  //       const templateVars = {user_id: req.session.user_id, id: result.rows[0].name, username: result.rows[0].name }
  //       db.query('SELECT * FROM listings WHERE user_id = $1 ORDER BY time_created DESC LIMIT 10;',[req.params.user_id]).then(result => {
  //         const listings = result.rows;
  //         res.send(listings);
  //       }).catch(err => console.error(err));
  //     }).catch(err => console.error(err));
  //   }
  // });

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
