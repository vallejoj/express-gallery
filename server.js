const gallery= require('./routes/gallery.js');
const express = require('express');
const exphbs = require('express-handlebars');
const db = require ('./models');
const PORT = process.env.PORT || 8000;
const bp = require('body-parser');
const app = express();
app.use(bp.urlencoded());
app.use(express.static('public'));

const methodOverride = require('method-override');
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use('/css', express.static('css'));
app.use(bp.urlencoded());
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



const server = app.listen(PORT, () =>{
  db.sequelize.sync()
  console.log(`Running on ${PORT}`);
});
