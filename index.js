'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const transactionroutes = require('./routes/transactionroutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/', transactionroutes.routes);


port=process.env.PORT || 5000
app.listen(port, () => console.log('App is listening on url http://localhost:' + config.port));