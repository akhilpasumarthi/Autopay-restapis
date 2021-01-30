const express = require('express');
const {
       addtransaction, testing,gettransaction,maketransaction
      } = require('../controllers/transactioncontroller');

const router = express.Router();

router.post('/transaction/:id', addtransaction);
router.get('/',testing)
router.get('/gettransaction/:id',gettransaction)
router.get('/maketransaction/:id',maketransaction)

module.exports = {
    routes: router
}
