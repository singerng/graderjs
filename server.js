// import modules
const express        = require('express');
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const busboy         = require('connect-busboy');
const console        = require('console');


// config
const db = require('./server/config/db');
const port = process.env.PORT || 8080;

// mongoose.connect(db.url);

// configure express app
const app = express();

app.use(busboy);
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/static')); // static files

// hookup routes
const routes = require('./server/routes');
app.use('/api', routes);
app.get('*', (req, res) => res.sendFile(__dirname + '/dist/index.html')); // route to angular frontend

// start app
app.listen(port);
console.log("server running on port " + port);

module.exports = app;
