const express = require('express');
const {
       addtransaction 
      } = require('../controllers/transactioncontroller');

const router = express.Router();

router.post('/transaction', addtransaction);



module.exports = {
    routes: router
}
