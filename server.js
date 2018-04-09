const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

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
            res.status(500).send({ api_status: "error", error_details: err });
        } else {
            res.status(200).send(results);
        }
      })
  })

app.post('/api/product', (req, res) => {
    // console.log(req.body)
    db.collection('product').save(req.body, (err, result) => {
        if (err) {
            res.status(500).send({ api_status: "error", error_details: err });
        } else {
            res.status(200).send(result.ops[0]);
        }
    })

    
  })

  app.get('/api/product', (req, res) => {
      console.log(req.query);
      find_one_query = {id: req.query.id};
    db.collection('product').findOne(find_one_query, function(err, result) {
        if (err) {
            res.status(500).send({ api_status: "error", error_details: err });
        } else {
            res.status(200).send(result);
        }
      })
  })
