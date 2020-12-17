'use strict';

const firebase = require('../db');
const Student = require('../models/transaction');
const firestore = firebase.firestore();


const addtransaction = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('transactions').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}





module.exports = {
    addtransaction}   