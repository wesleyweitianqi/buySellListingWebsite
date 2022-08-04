const express = require('express');
const router  = express.Router();
const queryText = require('./helper')

module.exports = (db) => {

  // const getAllListings = function (options, limit = 15) {

    // const queryParams = (options) =>{
    //   let queryString = `SELECT * FROM listings `;

    //   if (Object.keys(options).length > 0) {
    //     if (options.minimum_price) {
    //       queryParams.push(`${options.minimum_price}`);
    //       queryString += `WHERE price > $${queryParams.length} `;
    //     }
    //     if (options.maximum_price) {
    //       queryParams.push(`${options.maximum_price}`);
    //       if (!options.minimum_price) {
    //         queryString += `WHERE price < $${queryParams.length} `;
    //       } else {
    //         queryString += `AND price < $${queryParams.length} `;
    //       }
    //     }
    //     if (options.brand) {
    //       queryParams.push(`%${options.brand}%`);
    //       if (!options.minimum_price && !options.maximum_price) {
    //         queryString += `WHERE brand LIKE $${queryParams.length} `;
    //       } else {
    //         queryString += `AND brand LIKE $${queryParams.length} `;
    //       }
    //     }
    //     if (options.model) {
    //       queryParams.push(`%${options.model}%`);
    //       if (!options.minimum_price && !options.maximum_price && !options.brand) {
    //         queryString += `WHERE model LIKE $${queryParams.length} `;
    //       } else {
    //         queryString += `AND model LIKE $${queryParams.length} `;
    //       }
    //     }
    //     if (options.year) {
    //       queryParams.push(`${options.year}`);
    //       if (!options.minimum_price && !options.maximum_price && !options.brand && !options.model) {
    //         queryString += `WHERE year = $${queryParams.length} `;
    //       } else {
    //         queryString += `AND year = $${queryParams.length} `;
    //       }
    //     }
    //   }

    //   queryParams.push(limit);
    //   queryString += `
    //   GROUP BY id
    //   ORDER BY price
    //   LIMIT $${queryParams.length};
    //   `;
    //   return queryString;

    // }




    // return db.query(queryString, queryParams)
    //   .then((result) => {
    //     // console.log(queryParams);
    //     return result.rows;
    //   });
  // };

  //--------------------------------function--------------
  // create searchAPI
  // router.get('/search', (req, res) => {
  //   if (req.session.user_id) {
  //     db.query('SELECT * FROM users WHERE id = $1;', [req.session.user_id]).then((result) => {
  //       db.query(queryParams(options))
  //       .then(result => {
  //         res.send(result);
  //       }).catch(err => console.error(err));
  //     }).catch(err => console.error(err));
  //   }
  // });



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
