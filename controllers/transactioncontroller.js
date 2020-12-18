'use strict';

const firebase = require('../db');
const Student = require('../models/transaction');
const firestore = firebase.firestore();


const addtransaction = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        //let docid="";
        await firestore.collection('users').where("rfid","==",id).get().then( async function(querySnapshot) {
            let docid;
            querySnapshot.forEach( async function (doc) {
                // doc.data() is never undefined for query doc snapshots
                docid=doc.id;
                console.log(doc.id, " => ", doc.data());
                console.log(docid);
                await firestore.collection('users').doc(doc.id).collection('transactions').doc().set(data);
            });
        })
        
        //await firestore.collection('users').doc(docid).collection('transactions').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const testing=async(req,res,next)=>{
    res.send("it is working");
}




module.exports = {
    addtransaction,
    testing
}   