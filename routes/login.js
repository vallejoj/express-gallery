const express = require('express');
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models').User;

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
      })
  })
  .catch(err=>{
    console.log(err)
  })
})

const saltRound = 10;
module.exports = router;
