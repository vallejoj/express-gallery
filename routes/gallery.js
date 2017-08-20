const express = require('express');
const router = express.Router();
const app = express();

const Gallery = require('../models').Gallery;
const photoMetas = require('../collections/photoMeta.js').photoMetas;

router.get('/',(req,res) => {
  Gallery.findAll({
    order: [ [ "createdAt", "DESC"]]
  })
  .then(gallery =>{
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
 Gallery.create({
   link: req.body.link,
   author: req.body.author,
   description: req.body.description
 })
 .then((data)=>{
   Gallery.findAll({
     limit:1,
     order: [ [ "createdAt", "DESC"]]
   })
 .then((item)=>{
   console.log("ITEM: ", item[0].id);
        if(req.body.meta){
          let metaObj = req.body.meta;
          metaObj.id = item[0].id;
          photoMetas().insertOne( metaObj );
             res.redirect('/gallery')
        }else{
          res.redirect('/gallery')
        }

    })
 })
  .catch((err)=>{
   console.log(err)
 })
});

router.get('/logins', (req,res)=>{
  Gallery.findAll()
  .then(gallery =>{
    res.render('gallery/login', {
      gallery
    })
  })
  .catch((err)=>{
    console.log(err)
  })
})

  router.get('/:id',(req,res) => {
    Gallery.findById(parseInt(req.params.id))
      .then((photo) =>{
        res.render('gallery/photo', {photo: photo})
    })
      .catch((err)=>{
        console.log(err)
    })
  });

  const removeValues = (obj) => {
    for(var key in obj){
      if(obj.hasOwnProperty(key)){
        obj[key] = "";
      }
    }
    return obj;
  }

  router.route('/:id/edit')
    .get((req,res)=>{
        var photoID = parseInt(req.params.id)
          var query = {id: photoID}
        Gallery.findById(photoID)
      .then((photo) =>{
        var query = {id: photoID}
        photoMetas().findOne(query,{id:0, _id:0})
        .then((data)=>{
        console.log('here is my', data)
        res.render('gallery/edit', {
          photo: photo,
          data:data
        })
    })
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
      .then((picture)=>{
      console.log(req.body)
      var metaRemove = req.body
      var addMeta = req.body.meta
      var photoID = parseInt(req.params.id)
      var query = {id: photoID}

      delete metaRemove.author;
      delete metaRemove.link;
      delete metaRemove.description;
      photoMetas().findOne(query,(err,data)=>{
        if(data){
          photoMetas().update(
            query,
            {
              $set: addMeta
            }
          )
          photoMetas().update(
            query,
            {
              $unset: removeValues(metaRemove)
            }
          )
        }else{
          var metaObj = req.body.meta;
          metaObj.id = pictureID;
          photoMeta().insertOne(metaObj)
        }
      })
      })
      .then((gallery) =>{
        res.redirect(`/gallery/${req.params.id}/edit`)
      })
      .catch((err)=>{
        console.log(err)
      })

    })
    .delete((req,res)=>{
      Gallery.destroy({
        where:{
          id:req.params.id
        }
      })

      .then((gallery) =>{
        photoMetas().findOneAndDelete({id:pictureID});
       res.redirect('/gallery')
      })
      .catch((err)=>{
        console.log(err)
      })
    });


module.exports = router;
