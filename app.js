const express = require('express');
const app = express();
const api = require('./api/v1/index');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
const connection = mongoose.connection;

app.set('port', (process.env.port || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/api/v1', api);
app.use((req, res) => {
    const err = new Error('404 - Not Found !!');
    err.status = 404;
    res.json({msg: '404 - Not Found !!', err: err});
});

mongoose.connect('mongodb://localhost:27017/whiskycms', { useNewUrlParser: true });
connection.on('error', (err) => {
    console.error(`connection to mongdb error: ${err.message}`);
});

connection.once('open', () => {
    console.log('Connected to Mongodb');

    app.listen(app.get('port'), () => {
        console.log(`express server listening on port ${app.get('port')} !!`);
    });
});
