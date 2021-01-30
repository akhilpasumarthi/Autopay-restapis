const express = require('express');
const {
       addtransaction, testing,gettransaction
      } = require('../controllers/transactioncontroller');

const router = express.Router();

router.post('/transaction/:id', addtransaction);
router.get('/',testing)
router.get('/gettransaction/:id',gettransaction)


module.exports = {
    routes: router
}
