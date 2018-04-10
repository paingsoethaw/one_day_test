const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

app.use(bodyParser.json())

var db
MongoClient.connect('mongodb://lab_user:lab_user123@ds239309.mlab.com:39309/one_day_test', (err, client) => {
    if (err) return console.log(err)
    db = client.db('one_day_test')
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
})

app.get('/', (req, res) => {
    db.collection('product').find().toArray(function (err, results) {
        if (err) {
            res.status(500).json({ api_status: "error", error_details: err });
        } else {
            res.status(200).json(results);
        }
    })
})


//   challenge 1: POST request, save product information
app.post('/api/product', (req, res) => {
    var result_json = {
        api_status: "",
        data: {}
    };
    var name = req.body.name;
    var price = req.body.price;
    if (!name || name.length < 2 || name.length > 50) {
        result_json.api_status = "error";
        result_json.data = '"Name" is required and must be a string with length between 0 and 50';
        return res.status(400).json(result_json)
    }
    if (typeof price !== 'number') {
        price = parseInt(price);
    }
    if (isNaN(price) || price < 0) {
        result_json.api_status = "error";
        result_json.data = '"Price" is required and must be number';
        return res.status(400).json(result_json)
    }
    db.collection('product').save(req.body
    ).then(function (result) {
        result_json.api_status = "good";
        result_json.data = result.ops[0];
        res.status(201).json(result_json);
    }).catch(function (err) {
        result_json.api_status = "error";
        result_json.data = err;
        res.status(500).json(result_json)
    })
})

//   challenge 2: GET request, get product information by ID
app.get('/api/product', (req, res) => {
    var result_json = {
        api_status: "",
        data: {}
    };
    var idCheck = ObjectId.isValid(req.query.id);
    if (!idCheck) {
        result_json.api_status = "error";
        result_json.data = "Invalid ID Format";
        res.status(200).json(result_json)
    }
    db.collection('product').findOne({ "_id": new ObjectId(req.query.id) }
    ).then(function (result) {
        result_json.api_status = "good";
        result_json.data = result;
        res.status(200).json(result_json);
    }).catch(function (err) {
        result_json.api_status = "error";
        result_json.data = err;
        res.status(500).json(result_json)
    })
})

//   challenge 3: PUT request, update product information by ID
app.put('/api/product/:id', (req, res) => {
    var result_json = {
        api_status: "",
        data: {}
    };
    var name = req.body.name;
    var price = req.body.price;
    if (!name || name.length < 2 || name.length > 50) {
        result_json.api_status = "error";
        result_json.data = '"Name" is required and must be a string with length between 0 and 50';
        return res.status(400).json(result_json)
    }
    if (typeof price !== 'number') {
        price = parseInt(price);
    }
    if (isNaN(price) || price < 0) {
        result_json.api_status = "error";
        result_json.data = '"Price" is required and must be number';
        return res.status(400).json(result_json)
    }
    var idCheck = ObjectId.isValid(req.params.id);
    if (!idCheck) {
        result_json.api_status = "error";
        result_json.data = "Invalid ID Format";
        res.status(200).json(result_json)
    }
    db.collection('product').findOneAndUpdate(
        { "_id": new ObjectId(req.params.id) },
        { $set: req.body },
        { new: true, returnOriginal: false }
    ).then(function (updated_result) {
        result_json.api_status = "good";
        result_json.data = updated_result.value;
        res.status(200).json(result_json);
    }).catch(function (err) {
        result_json.api_status = "error";
        result_json.data = err;
        res.status(500).json(result_json)
    })

})

//   challenge 4: Delete request, delete product information by ID
app.delete('/api/product/:id', function (req, res) {
    var result_json = {
        api_status: "",
        data: []
    };
    var idCheck = ObjectId.isValid(req.params.id);
    if (!idCheck) {
        result_json.api_status = "error";
        result_json.data = "Invalid ID Format";
        res.status(200).json(result_json)
    }
    db.collection('product').deleteOne(
        { "_id": new ObjectId(req.params.id) },
        { new: true, returnOriginal: false }
    )
        .then(function (coll) {
            result_json.api_status = "good";
            result_json.data = [req.params.id];
            res.status(200).json(result_json);
        })
        .catch(function (err) {
            result_json.api_status = "error";
            result_json.data = err;
            res.status(500).json(result_json)
        })
})