const express = require('express');
const {
       addtransaction, testing 
      } = require('../controllers/transactioncontroller');

const router = express.Router();

router.post('/transaction', addtransaction);
router.get('/',testing)



module.exports = {
    routes: router
}
