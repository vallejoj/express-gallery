const express = require('express');
const router = express.Router();
const app = express();

const Gallery = require('../models').Gallery;


router.get('/',(req,res) => {
  Gallery.findAll({
    order: [ [ "createdAt", "DESC"]]
  })
  .then(gallery =>{
      console.log("look at our", req.user)
    res.render('gallery/index', {
      gallery,
      user:req.user
    })
  })
  .catch((err)=>{
    console.log(err)
  })
});

router.route('/new')
.get((req,res)=>{
  Gallery.findAll()
  .then(gallery =>{
    res.render('gallery/new', {
      gallery
    })
  })
  .catch((err)=>{
    console.log(err)
  })
})
.post((req,res) => {
  console.log('this is author:',req.body)
 Gallery.create({
   link: req.body.link,
   author: req.body.author,
   description: req.body.description
 })
 .then((data)=>{
   res.redirect('/gallery')
 }).catch((err)=>{
   console.log(err)
 })
});


  router.get('/:id',(req,res) => {
    console.log('first get')
    Gallery.findById(parseInt(req.params.id))
      .then((photo) =>{
        res.render('gallery/photo', {photo: photo})
    })
      .catch((err)=>{
        console.log(err)
    })
  });
  router.route('/:id/edit')
    .get((req,res)=>{
      console.log('we are getting')
        Gallery.findById(parseInt(req.params.id))
      .then((photo) =>{
        res.render('gallery/edit', {photo: photo})
      })
      .catch((err)=>{
        console.log(err)
      })
    })
    .put((req,res) =>{
      Gallery.update({
        author: req.body.author,
        link: req.body.link,
        description: req.body.description
      },{
        where: {
          id:req.params.id
        }
      })
      .then((gallery) =>{
        res.redirect(`/gallery/${req.params.id}/edit`)
      })
      .catch((err)=>{
        console.log(err)
      })
    })
    .delete((req,res)=>{
      console.log('delete', req.params.id)
      Gallery.destroy({
        where:{
          id:req.params.id
        }
      })
      .then((gallery) =>{
       res.redirect('/gallery')
      })
      .catch((err)=>{
        console.log(err)
      })
    });
module.exports = router;
