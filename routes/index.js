var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const Motorcycle = require("../Motorcycle");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection
const dbURI =
 "mongodb+srv://xxxxxx:xxxxxxxxx@btfirstcluster.q5kdr.mongodb.net/Motorcycle?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);



/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});

/* GET all ToDos */
router.get('/Motorcycles', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  Motorcycle.find({}, (err, motorcycles) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(motorcycles);
  });
});




/* post a new ToDo and push to Mongo */
router.post('/NewMotorcycle', function(req, res) {

    let oneNewMotorcycle = new Motorcycle(req.body);  // call constuctor in ToDos code that makes a new mongo ToDo object
    console.log(req.body);
    oneNewMotorcycle.save((err, motorcycle) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      console.log(motorcycle);
      res.status(201).json(motorcycle);
      }
    });
});


router.delete('/DeleteMotorcycle/:id', function (req, res) {
  Motorcycle.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Motorcycle successfully deleted" });
  });
});


router.put('/UpdateMotorcycle/:id', function (req, res) {
  const { body: { make, model, vin, inWarehouse } } = req;
  Motorcycle.findOneAndUpdate(
    { _id: req.params.id },
    { make, model, vin, inWarehouse },
   { new: true },
    (err, todo) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(todo);
    })
  });


  /* GET one ToDos */
router.get('/FindMotorcycle/:id', function(req, res) {
  console.log(req.params.id );
  Motorcycle.find({ _id: req.params.id }, (err, motorcycle) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(motorcycle);
  });
});

module.exports = router;
