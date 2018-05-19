// import modules
const express        = require('express');
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const busboy         = require('connect-busboy');
const console        = require('console');
const mongoose       = require('mongoose');


// config
const db = require('./server/config/db');
const port = process.env.PORT || 8080;

const models = require('./server/models');
mongoose.connect(db.url);
mongoose.connection.on('error', console.error.bind(console, 'mongodb connection error:'));

// configure express app
const app = express();

// app.use(busboy);
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + '/dist')); // static files

// hookup routes
const routes = require('./server/routes');
app.use('/api', routes);
app.get('*', (req, res) => res.sendFile(__dirname + '/dist/index.html')); // route to angular frontend

// start app
app.listen(port);
console.log("server running on port " + port);

module.exports = app;
