var Tx = require('ethereumjs-tx');
const Web3=require('web3')
var url="https://ropsten.infura.io/v3/91b956a485de4d7681f8c1e82c65b4b9"
const web3=new Web3(url)

const account1='0x610b6fa884c62183Cb0060122F13B4195C240E79'
const account2='0x62697b036fb68B61e15746eCf8950A823a1849F4'
const privatekey=Buffer.from('fb10119c1c39e5e25fc2818fdf699a4d49b0504ba1e3c884a6deb0a62f0e9e20','hex')
web3.eth.getBalance(account1,(err,bal)=>{
    console.log("form wallet created using web3.js",web3.utils.fromWei(bal,'ether'))
})
const balance= (account1)=>{
    web3.eth.getBalance(account1,(err,bal)=>{
    console.log("from metamask account",web3.utils.fromWei(bal,'ether'))
    return bal;
})}

const transaction=web3.eth.getTransactionCount(account1,(err,txcount)=>{
    const txobject={
        nonce: web3.utils.toHex(txcount),
        to: account2,
        value: web3.utils.toHex(web3.utils.toWei('0.2','ether')),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei'))
    }
    const tx=new Tx(txobject)
    tx.sign(privatekey)
    const serializedTransaction=tx.serialize()
    const raw='0x'+serializedTransaction.toString('hex')
    web3.eth.sendSignedTransaction(raw,(err,txhash)=>{
        console.log(err)
        console.log('txhassh',txhash)
    })
})

