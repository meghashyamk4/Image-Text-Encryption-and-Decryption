const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');

const homeRoutes = require('./routes/home');
// const resultsRoutes = require('./routes/results');

app.use(bodyParser.urlencoded({extended: false}));

app.use(homeRoutes.routes);
// app.use(resultsRoutes);

app.use((req, res, next) => {
    res.status(404).render(path.join(__dirname, 'views', '404.ejs'));
});

app.listen(3000);
