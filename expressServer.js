'use strict'

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

app.disable('x-powered-by');

app.get('/pets', function (req, res) {
  fs.readFile(petsPath, 'utf8', function (err, data) {
    if(err){
      console.error(err.stack);
      return res.sendStatus(500);
    };
    var pets = JSON.parse(data);
    res.send(pets);
  });
});

app.get('/pets/:index', function (req, res) {
  fs.readFile(petsPath, 'utf8', function (err, data) {
    if(err){
      console.error(err.stack);
      return res.sendStatus(500);
    };
    var index = parseInt(req.params.index);
    var pets = JSON.parse(data);
    if (index > pets.length-1 || index < 0 || Number.isNaN(index)) {
      return res.sendStatus(404);
    }
    res.send(pets[index]);
  });
});

app.use(function(req, res){
  res.sendStatus(404);
});

app.listen(port, function(){
  console.log('Listen on port ', port);
});
