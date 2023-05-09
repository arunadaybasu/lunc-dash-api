var express = require('express');
var router = express.Router();
const axios = require('axios');
var moment = require('moment');
const nodeCron = require("node-cron");
const si = require('systeminformation');

const fcdURL = 'https://terra-classic-fcd.publicnode.com/v1/';

var res1 = "dashsupplyapi endpoint working";
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

router.get('/onchain/sysinfo', async function(req, res, next) {

  // IP Check
  var ip_check;
  await si.networkInterfaces()
  .then((data) => {
    ip_check = data[0].ip4;
  })
  .catch(error => console.error(error));
  console.log(ip_check);
  if (ip_check != '18.223.229.233')
    return;

  const json = {
    "status": 200,
    "timestamp": moment().valueOf()
  };

  res.header("Access-Control-Allow-Origin", "*");
  res.send(json);

});

router.get('/onchain/csupply', function(req, res, next) {

  const json = {
    "status": 200,
    "timestamp": moment().valueOf()
  };

  console.log(moment().valueOf());

  res.header("Access-Control-Allow-Origin", "*");
  res.send(json);

  new Promise(async (resolve, reject) => {

  try {
      response = await axios.get(fcdURL + 'circulatingsupply/uluna', {
        // timeout: 50000, // Timeout of 10 seconds
      });
    } catch(ex) {
      response = null;
      // error
      console.log(ex);
      // reject(ex);
    }

    if (response) {

      const respjson1 = {
        "status": 200,
        "result": response.data,
        "timestamp": moment().valueOf()
      };

      // Use connect method to connect to the server
      await dbCclient.connect();
      console.log('Connected successfully to MongoDB Server');
      const db = dbCclient.db(dbName);
      const collection_csupply = db.collection('circulating_supply');
      // await collection_csupply.deleteMany({});
      const insertResult = await collection_csupply.insertOne(respjson1);
      console.log('Inserted documents =>', insertResult);

    }

  });
  

});

router.get('/onchain/cron-csupply', function(req, res, next) {

  const json = {
    "status": 200,
    "timestamp": moment().format()
  };

  const job = nodeCron.schedule("0 * * * * *", () => {

    console.log(moment().format());

    new Promise(async (resolve, reject) => {

    try {
        response = await axios.get(fcdURL + 'circulatingsupply/uluna', {});
      } catch(ex) {
        response = null;
        // error
        console.log(ex);
        // reject(ex);
      }

      if (response) {

        const respjson1 = {
          "status": 200,
          "result": response.data,
          "timestamp": moment().valueOf()
        };

        // Use connect method to connect to the server
        await dbCclient.connect();
        console.log('Connected successfully to MongoDB Server');
        const db = dbCclient.db(dbName);
        const collection_csupply = db.collection('circulating_supply');
        // await collection_csupply.deleteMany({});
        const insertResult = await collection_csupply.insertOne(respjson1);
        console.log('Inserted documents =>', insertResult);

      }

    });
  });

  job.start();

  res.header("Access-Control-Allow-Origin", "*");
  res.send(json);

});

router.get('/onchain/get-csupply', async function(req, res, next) {
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
