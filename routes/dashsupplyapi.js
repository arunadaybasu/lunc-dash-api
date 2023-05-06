var express = require('express');
var router = express.Router();
const axios = require('axios');
var moment = require('moment');
const nodeCron = require("node-cron");

const fcdURL = 'https://fcd.terrarebels.net/';

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

router.get('/onchain/csupply', function(req, res, next) {

  new Promise(async (resolve, reject) => {

  try {
      response = await axios.get(fcdURL + 'v1/circulatingsupply/uluna', {
        // headers: {
        //   'X-CMC_PRO_API_KEY': API_KEY,
        // },
      });
    } catch(ex) {
      response = null;
      // error
      console.log(ex);
      // reject(ex);
    }

    if (response) {
      // success
      const json = {
        "status": 200,
        "result": response.data,
        "timestamp": moment().unix()
      };
      console.log(json);
      resolve(json);

      // Use connect method to connect to the server
      await dbCclient.connect();
      console.log('Connected successfully to MongoDB Server');
      const db = dbCclient.db(dbName);
      const collection_csupply = db.collection('circulating_supply');
      // await collection_csupply.deleteMany({});
      const insertResult = await collection_csupply.insertOne(json);
      console.log('Inserted documents =>', insertResult);

      res.header("Access-Control-Allow-Origin", "*");
      res.send(json);
    }

  });

});

router.get('/onchain/cron-csupply', function(req, res, next) {

  const json = {
    "status": 200,
    "timestamp": moment().format()
  };

  const job = nodeCron.schedule("0 */5 * * * *", () => {

    console.log(moment().format());

    new Promise(async (resolve, reject) => {

    try {
        response = await axios.get(fcdURL + 'v1/circulatingsupply/uluna', {});
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
          "timestamp": moment().unix()
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

  await dbCclient.connect();
  console.log('Connected successfully to MongoDB Server');
  const db = dbCclient.db(dbName);
  const collection_csupply = db.collection('circulating_supply');
  const filteredDocs1 = await collection_csupply.find({}).sort( { 'timestamp': -1 } ).limit(10).toArray();

  const respjson1 = {
    "status": 200,
    "result": filteredDocs1,
    "timestamp": moment().unix()
  };

  res.header("Access-Control-Allow-Origin", "*");
  res.send(respjson1);

});


module.exports = router;
