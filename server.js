const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session');
const RedisStore = require("connect-redis")(session);
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');

const app = express();

const db = require ('./models');
const CONFIG = require("./config/config.json");
const User = require('./models').User;
const PORT = process.env.PORT || 8000;
const gallery= require('./routes/gallery.js');
const login = require('./routes/login.js');

app.use(bp.urlencoded());
app.use(session({
  store: new RedisStore(),
  secret: CONFIG.SECRET_SESSION,
  cookie: {
    maxage: 600
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));


const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(bp.urlencoded());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      where:{
        username:username
      }
    }).then((user) => {
      bcrypt.compare(password, user.password)
      .then(result => {
        if(result){
          return done(null,user)
        }else{
          return done(null, false, {message:'Password Incorrect'})
        }
      }).catch( err=> {
        console.log(err)
      })
    }).catch((err) => {
      console.log('we found this', err)
      return done(null, false, {message: 'Incorrect Username'})
    })
  }
));

app.use(methodOverride('X-HTTP-Method-Override'));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use('/gallery', gallery);
app.use('/login', login);


passport.serializeUser(function(user, done) {
  /////recieved LocalStrategy succession
  done(null, user.id);
  //build object to store into the session object.
});

passport.deserializeUser(function(userId, done) {
  User.findOne({
    where :{
      id: userId
    }
  }).then((user) => {
    return done(null, {
      id: user.id,
      username: user.username
    })
  }).catch((err) => {
    done(err, user);
  })        // ^ add the serialized information into the request object
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/gallery/new");
});



app.post('/login', passport.authenticate('local',
 {
  successRedirect: '/gallery',
  failureRedirect: '/gallery/new'
}))

function userAuthenticated (req, res, next){
  if (req.isAuthenticated()){
    next()
  }else{
      res.redirect('/login')
    }
  }

const server = app.listen(PORT, () =>{
  db.sequelize.sync()
  console.log(`Running on ${PORT}`);
});
