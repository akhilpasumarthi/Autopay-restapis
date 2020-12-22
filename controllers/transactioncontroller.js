'use strict';

const firebase = require('../db');
var admin = require("firebase-admin");
var Tx = require('ethereumjs-tx').Transaction;

var serviceAccount = require("../serviceAccountKey.json"); 
console.log(serviceAccount);
const firestore = firebase.firestore();
const Student = require('../models/transaction');
var dateTime = require('node-datetime');
const Web3=require('web3')
var url="https://ropsten.infura.io/v3/91b956a485de4d7681f8c1e82c65b4b9"
const web3=new Web3(url)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://autopay-425eb.firebaseio.com"
  });


const addtransaction = async (req, res, next) => {
    try {
        
        const id = req.params.id;
        const data = req.body;
        const merchantdata=req.body;
        const amount=data.amount;
        const name=data.from;
        //var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date())
        var dt = dateTime.create();
        var dt1=new Date();
        var formatted = dt.format('Y-m-d H:M:S');
        console.log(dt.format);
        const account1='0x610b6fa884c62183Cb0060122F13B4195C240E79'
        const account2='0x62697b036fb68B61e15746eCf8950A823a1849F4'
        const privatekey=Buffer.from('fb10119c1c39e5e25fc2818fdf699a4d49b0504ba1e3c884a6deb0a62f0e9e20','hex') 
        
        data.timestamp=dt1.valueOf();
        
          
        //let docid="";
        await firestore.collection('users').where("rfid","==",id).get().then( async function(querySnapshot) {
            let docid;
            querySnapshot.forEach( async function (document) {
                // doc.data() is never undefined for query doc snapshots
               // docdata=doc.data();
                console.log(document.id, " => ", document.data());
                console.log(docid);
                var docdata=document.data();
                var token=docdata.token;
                console.log(token)
                //console.log(docdata['token'])
                if(amount<500){
                  await  web3.eth.getBalance(account1,(err,bal)=>{
                     console.log("from metamask account",web3.utils.fromWei(bal,'wei'))
                     if(bal<amount){
                       console.log("no enough balance ");
                       res.status(200).send("no enough balance")
                     }else{
                       try  {
                         var value=amount.toString();

                         const transaction= web3.eth.getTransactionCount(account1,async(err,txcount)=> {
                           const txobject={
                               nonce: web3.utils.toHex(txcount),
                               to: account2,
                               value: web3.utils.toHex(web3.utils.toWei(value,'gwei')),
                               gasLimit: web3.utils.toHex(21000),
                               gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei'))
                           }
                           const tx=new Tx(txobject,{chain:'ropsten', hardfork: 'petersburg'})
                           tx.sign(privatekey)
                           const serializedTransaction=tx.serialize()
                           const raw='0x'+serializedTransaction.toString('hex')
                           await  web3.eth.sendSignedTransaction(raw,async(err,txhash)=>{
                               console.log(err)
                               console.log('txhassh',txhash)
                               data.transactionhash=txhash;
                               if(err==null)
                               {  
                                 data.status="paid";
                                 console.log(docdata.userid)
                                await firestore.collection('users').doc(document.id).collection('transactions').doc().set(data);
                                await firestore.collection('merchants').doc('r5uYd9Q0yjII1AstWBsm').collection('transactions').doc().set({
                                  from: docdata.name,
                                  time: dt1.valueOf(),
                                  amount: amount,
                                  transactionhash: txhash

                              });
                                 //console.log(document.id);
                                 
         
                                 var payload = {
                                   notification: {
                                     title: amount+"is paid to"+name,
                                     body: ""
                                   }
                                 };
                                 var options = {
                                   priority: "high",
                                   timeToLive: 60 * 60 *24
                                 };
                                 
                                 await admin.messaging().sendToDevice(token, payload, options)
                             .then(function(response) {
                             console.log("Successfully sent message:", response);
                            // res.send('Transaction successfuly');

                           })
                         .catch(function(error) {
                           console.log("Error sending message:", error);
                           res.status(200).send("no enough balance")
                         });
                                  
                               }
                           })
                       })
                       }catch{
         
                       }
                       
                     }
         
                 
                   })
                 }
                 else{

                  await firestore.collection('users').doc(document.id).collection('transactions').doc().set(data);
                  console.log(document.id);
                  

                  var payload = {
                    notification: {
                      title: name,
                      body: "Requesting amount of "+amount
                    }
                  };
                  var options = {
                    priority: "high",
                    timeToLive: 60 * 60 *24
                  };
                  
                  await admin.messaging().sendToDevice(token, payload, options)
              .then(function(response) {
              console.log("Successfully sent message:", response);
             // res.send('Transaction successfuly');

            })
          .catch(function(error) {
            console.log("Error sending message:", error);
            
          });
          res.status(200).send('Sent Transaction request successfully')
                          
                         console.log("over amount") 
                 }

            });
        }) 
        
        
        res.status(200).send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const testing=async(req,res,next)=>{
 res.send("its working")
  
}




module.exports = {
    addtransaction,
    testing
}   