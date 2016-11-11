'use strict'

var fs = require('fs');
var path = require('path');
var morgan = require('morgan');
var petsPath = path.join(__dirname, 'pets.json');

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var auth = require('basic-auth');

app.use(function(req, res, next) {
    var credentials = auth(req);
    if (!credentials || credentials.name !== 'admin' || credentials.pass !== 'meowmix') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Required"');
        res.setHeader('content-type', 'text/plain');
        return res.end('Unauthorized');
    } else {
      // res.send('Access Granted')
      return next();
    }
});

//prints out the url after each next
app.use(function(req, res, next) {
    console.log(req.url);
    next();
});

app.use(bodyParser.json());
app.use(morgan('short'));

// app.disable('x-powered-by');

// ----GET----

app.get('/pets', function(req, res, next) {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
            return next(err);
        };
        var pets = JSON.parse(data);
        res.send(pets);
    });
});

// ----GET WITH INDEX----

app.get('/pets/:index', function(req, res, next) {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
            return next(err)
        };
        var index = parseInt(req.params.index);
        var pets = JSON.parse(data);
        if (index > pets.length - 1 || index < 0 || Number.isNaN(index)) {
            return res.sendStatus(404);
        }
        res.send(pets[index]);
    });
});

// ----POST----

app.post('/pets', function(req, res, next) {
    var body = req.body;
    console.log(body);
    if (body.age && body.kind && body.name) {
        fs.readFile(petsPath, 'utf8', function(err, data) {
            if (err) {
              return next(err);
            };
            var pets = JSON.parse(data);
            pets.push(body);
            var petsJSON = JSON.stringify(pets)
            fs.writeFile(petsPath, petsJSON, function(writeErr) {
                if (writeErr) {
                    throw writeErr;
                }
            });
            // console.log(body);
            return res.send(body);
        })
    } else {
        return res.send(400);
    }
});

// ----PUT----

app.put('/pets/:index', function(req, res, next) {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
            return next(err);
        };
        var pets = JSON.parse(data);
        var index = Number.parseInt(req.params.index);
        if (index > pets.length - 1 || index < 0 || Number.isNaN(index)) {
            return res.sendStatus(404);
        };
        var body = req.body;
        if (body.age && body.kind && body.name) {
            pets[index] = body;
            var petsJSON = JSON.stringify(pets)
            fs.writeFile(petsPath, petsJSON, function(writeErr) {
                if (writeErr) {
                    throw writeErr;
                }
            });
            // console.log(body);
            return res.send(body);
        } else {
            return res.sendStatus(400);
        };
    });
    // console.log('code that will allow us to change a certain index');
});

// ----DELETE----

app.delete('/pets/:index', function(req, res, next) {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
          return next(err);
        };
        var pets = JSON.parse(data);
        var index = Number.parseInt(req.params.index);
        if (index > pets.length - 1 || index < 0 || Number.isNaN(index)) {
            return res.sendStatus(404);
        };
        var pet = pets.splice(index, 1)[0];
        var petsJSON = JSON.stringify(pets);
        fs.writeFile(petsPath, petsJSON, function(writeErr) {
            if (writeErr) {
                throw writeErr;
            }
        });
        // console.log(body);
        return res.send(pet);
    });
});

// ----PATCH----

app.patch('/pets/:index', function(req, res, next) {
    var body = req.body;
    if (isNaN(body.age) && !body.kind && !body.name) {
        return next(err);
    }
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
          return next(err);
        };
        var index = req.params.index;
        var pets = JSON.parse(data);
        if (index > pets.length - 1 || index < 0 || Number.isNaN(index)) {
            return res.sendStatus(404);
        };
        Object.assign(pets[index], body);
        var petsJSON = JSON.stringify(pets);
        console.log(pets);
        fs.writeFile(petsPath, petsJSON, function(writeErr) {
            if (writeErr) {
                throw writeErr;
            };
            res.send(pets[index]);
        });
    });
})

app.use(function(req, res) {
    res.sendStatus(404);
});

app.listen(port, function() {
    console.log('Listen on port ', port);
});

module.exports = app;
