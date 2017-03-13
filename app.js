const express = require('express');
const favicon = require('serve-favicon')
const app = express();
const http = require('http');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const server = http.createServer(app);
const currentStatic = require('./gulp/config').root;
const config = require('./config.json');
const uploadDir = config.upload;

const mongoose = require('mongoose');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'portfolio',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

mongoose.Promise = global.Promise;

// mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
//     user: config.db.user,
//     pass: config.db.password
// }).catch(e => {
//     console.error(e);
//     throw e;
// });

mongoose.connect(config.connection.string);

console.log(mongoose);

// models
require('./models/skill');
require('./models/blog');
require('./models/work');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, currentStatic, '/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, currentStatic)));
// routes
app.use('/', require('./routes/index'));
app.use('/works', require('./routes/works'));
app.use('/blog', require('./routes/blog'));
app.use('/admin', require('./routes/admin'));
app.use('/admin/about', require('./routes/admin/about'));
app.use('/admin/blog', require('./routes/admin/blog'));
app.use('/admin/works', require('./routes/admin/works'));
app.use('/about', require('./routes/about'));
app.use('/api/works', require('./routes/api/works'));

// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404).render('pages/404');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('pages/500');
});

// start server
server.listen(3000, '0.0.0.0');
server.on('listening', function () {

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    console.log('Express server started on port %s at %s', server.address().port);
});