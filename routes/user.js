const express =require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/post", (req, res) => {
    res.render('post');
  });
  router.post("/post", (req, res) => {
    console.log(req.body);
    res.render('post')
  });
  return router;
};
