const express = require('express');

const { router } = require('./routers/index.router');

const app = express();

app.set('views', './src/views');

app.use('/static', express.static(__dirname + '/assets'));

app.set('view engine', 'pug');

app.use('/', router);

app.listen(process.env.PORT || 4000 , () => {
    console.log('Server listen');
});
