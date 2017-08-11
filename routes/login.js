const express = require('express');
const router = express.Router();
const app = express();

const User = require('../models').User;


router.post('/new', (req,res)=>{
console.log('see path')
User.create({
  username: req.body.username,
  password: req.body.password
})
.then((data)=>{
  console.log('made new user',data)
  res.redirect('/gallery')
}).catch((err)=>{
  console.log(err)
})
})



module.exports = router;
