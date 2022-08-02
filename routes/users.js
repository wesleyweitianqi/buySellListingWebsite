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

    // if(bcrypt.compareSync(req.body.password, rows['password'])) {
    //   req.session.user_id = rows.password;
    //   return res.redirect('/listings');
    // }
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
    console.log('------------------')
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
        console.log('result:', result.rows);
        res.render('listings');
      }
    }).catch(err => console.error(err));


  });

    // const rows = await db.query('SELECT * FROM users WHERE users.email = $1 AND users.password = $2;',[email, password]);
    // console.log(rows);
    // if (req.body.email === "" || req.body.password === "") {
    //   return res.sendStatus(400).end();
    // };
    // if (req.body.email === login[0].email) {
    //   return res.send('This email was registered');
    // }
    // console.log(rows);
    // req.session.user_id = rows.id;
    // return res.redirect('/listing');


  router.get('/listings', (req, res) => {
    res.render('listings');
  })
  return router;
};
