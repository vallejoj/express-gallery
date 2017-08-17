const express = require('express');
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models').User;
const saltRound = 10;

router.post('/new', (req,res)=>{
  console.log( "username:",req.body.username)
  console.log("password:" ,req.body.password);

bcrypt.genSalt(saltRound)
  .then(salt =>{
    bcrypt.hash(req.body.password, salt)
      .then(hash=>{
        console.log('is hash working??',hash)
        User.create({
          username: req.body.username,
          password: hash
        })
        res.redirect("/gallery");
      })
  })
  .catch(err=>{
    console.log(err)
  })
});


module.exports = router;
