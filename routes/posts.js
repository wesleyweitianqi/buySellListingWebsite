const express = require('express');
const postRoutes = express.Router();

module.exports = function() {
  postRoutes.get('/', (req,res) => {
    if (err) {
      res.send(err);
    } else {
      res.render('post', {user_id : ''});
    }
  });

  postRoutes.post('/', (req,res) => {
    if (!req.body.text) {
      res.send('no content');
    } else {
      res.send(req.body);
    }
  })
}
