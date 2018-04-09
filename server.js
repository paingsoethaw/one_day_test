const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

// app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

var db
MongoClient.connect('mongodb://lab_user:lab_user123@ds239309.mlab.com:39309/one_day_test', (err, client) => {
  if (err) return console.log(err)
  db = client.db('one_day_test') // whatever your database name is
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.get('/', (req, res) => {
    db.collection('product').find().toArray(function(err, results) {
        if (err) {
            res.status(500).json({ api_status: "error", error_details: err });
        } else {
            res.status(200).json(results);
        }
      })
  })

//   challenge 1: POST request, save product information
app.post('/api/product', (req, res) => {
    // console.log(req.body)
    db.collection('product').save(req.body, (err, result) => {
        var result_json = {
            api_status: "",
            data: {}
        };
        if (err) {
            result_json.api_status = "error";
            res.status(500).json(result_json);
        } else {
            result_json.api_status = "good";
            result_json.data = result.ops[0];
            res.status(200).json(result_json);
        }
    })
  })

//   challenge 2: GET request, get product information by ID
  app.get('/api/product', (req, res) => {
      console.log(req.query);

    db.collection('product').findOne({_id: new ObjectId(req.query.id)}, function(err, result) {
        // console.log(result);
        var result_json = {
            api_status: "",
            data: {}
        };
        if (err) {
            result_json.api_status = "error";
            res.status(500).json(result_json);
        } else {
            result_json.api_status = "good";
            result_json.data = result;
            res.status(200).json(result_json);
        }
      })
  })
