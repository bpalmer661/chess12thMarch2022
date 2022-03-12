//index.js 

const functions = require("firebase-functions");



const express = require('express'); //Line 1
const app = express(); //Line 2

const http = require('http').Server(app);



const cors = require('cors');
app.use(cors());




const { getTransactions
 } = require('./transactionsBackend')
 
 


app.get('/transactions/:email',getTransactions);



https://australia-southeast1-chess-51f78.cloudfunctions.net/api/transactions


exports.api = functions.region('australia-southeast1').https.onRequest(app);










