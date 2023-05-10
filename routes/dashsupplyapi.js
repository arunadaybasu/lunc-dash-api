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
    "result": 'Parameter "format" Incorrect. Options = 1-11',
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

    // 2 == formatted data for apexchats (last 100)

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

    // 3 == formatted data for list (last 100)

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
  else if (req.query.format == '4') {

    // 4 == formatted data for list (24 hours)

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({
      "timestamp": {
        $gt: moment().subtract(24, 'hours').valueOf(),
        $lt: moment().valueOf()
      }
    }).sort( { 'timestamp': -1 } ).toArray();

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
  else if (req.query.format == '5') {

    // 5 == formatted data for list (7 days)

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({
      "timestamp": {
        $gt: moment().subtract(7, 'days').valueOf(),
        $lt: moment().valueOf()
      }
    }).sort( { 'timestamp': -1 } ).toArray();

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
  else if (req.query.format == '6') {

    // 6 == formatted data for list (30 days)

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({
      "timestamp": {
        $gt: moment().subtract(30, 'days').valueOf(),
        $lt: moment().valueOf()
      }
    }).sort( { 'timestamp': -1 } ).toArray();

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
  else if (req.query.format == '7') {

    // 7 == formatted data for list (3 months)

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({
      "timestamp": {
        $gt: moment().subtract(3, 'months').valueOf(),
        $lt: moment().valueOf()
      }
    }).sort( { 'timestamp': -1 } ).toArray();

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
  else if (req.query.format == '8') {

    // 8 == formatted data for apexchats (24 hours)

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({
      "timestamp": {
        $gt: moment().subtract(24, 'hours').valueOf(),
        $lt: moment().valueOf()
      }
    }).sort( { 'timestamp': -1 } ).toArray();

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
  else if (req.query.format == '9') {

    // 9 == formatted data for apexchats (7 days)

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({
      "timestamp": {
        $gt: moment().subtract(7, 'days').valueOf(),
        $lt: moment().valueOf()
      }
    }).sort( { 'timestamp': -1 } ).toArray();
    
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
  else if (req.query.format == '10') {

    // 10 == formatted data for apexchats (30 days)

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({
      "timestamp": {
        $gt: moment().subtract(30, 'days').valueOf(),
        $lt: moment().valueOf()
      }
    }).sort( { 'timestamp': -1 } ).toArray();
    
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
  else if (req.query.format == '11') {

    // 11 == formatted data for apexchats (3 months)

    await dbCclient.connect();
    console.log('Connected successfully to MongoDB Server');
    const db = dbCclient.db(dbName);
    const collection_csupply = db.collection('circulating_supply');
    const filteredDocs1 = await collection_csupply.find({
      "timestamp": {
        $gt: moment().subtract(3, 'months').valueOf(),
        $lt: moment().valueOf()
      }
    }).sort( { 'timestamp': -1 } ).toArray();
    
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


  res.header("Access-Control-Allow-Origin", "*");
  res.send(respjson1);

});


module.exports = router;
