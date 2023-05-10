var express = require('express');
var router = express.Router();
const axios = require('axios');
var moment = require('moment');
const nodeCron = require("node-cron");

const fcdURL = 'https://terra-classic-fcd.publicnode.com/v1/';
const fcdURLRebels = 'https://fcd.terrarebels.net/';

var res1 = "dashsupplyapi endpoint working";
var pswd_valid = 0;
let response = null;

const { MongoClient } = require('mongodb');
// Connection URL
const dbUrl = 'mongodb://localhost:27017';
const dbCclient = new MongoClient(dbUrl);
// Database Name
const dbName = 'luncdb_onchain';

router.get('/', function(req, res, next) {
  
  res.send(res1)

});

router.get('/onchain/get-csupply', async function(req, res, next) {

  console.log(req.query.format);

  var respjson1 = {
    "status": 200,
    "result": 'Parameter "format" Incorrect. Options = 1,2',
    "timestamp": moment().valueOf()
  };

  var resArr1 = [];

  if (req.query.format == '1') {

    // 1 == raw data from db

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({}).sort( { 'timestamp': -1 } ).limit(100).toArray();

    respjson1 = {
      "status": 200,
      "result": filteredDocs1,
      "timestamp": moment().valueOf()
    };

  }
  else if (req.query.format == '2') {

    // 2 == formatted data for apexchats (dashboard)

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({}).sort( { 'timestamp': -1 } ).limit(100).toArray();

    for (var i = 0; i < filteredDocs1.length; i++) {
      resArr1.push([filteredDocs1[i].timestamp, filteredDocs1[i].result]);
    }

    console.log(resArr1);

    respjson1 = {
      "status": 200,
      "result": resArr1,
      "timestamp": moment().valueOf()
    };

  }
  else if (req.query.format == '3') {

    // 3 == formatted data for list (dashboard)

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({}).sort( { 'timestamp': -1 } ).limit(100).toArray();

    for (var i = 0; i < filteredDocs1.length; i++) {
      filteredDocs1[i].timestamp = moment(filteredDocs1[i].timestamp).format('YYYY-MM-DD HH:mm:ss');
      resArr1.push(filteredDocs1[i]);
    }

    console.log(resArr1);

    respjson1 = {
      "status": 200,
      "result": resArr1,
      "timestamp": moment().valueOf()
    };

  }

  res.header("Access-Control-Allow-Origin", "*");
  res.send(respjson1);

});


module.exports = router;
