#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];

if (cmd === 'read') {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        var pets = JSON.parse(data);
        var index = process.argv[3];
        if (index) {
            if (index >= pets.length || isNaN(index)) {
                console.error(`Usage: ${node} ${file} read INDEX`);
                process.exit(1);
            }
            console.log(pets[index]);
        } else if (err) {
            throw err;
        } else {
            console.log(pets);
        }
    })
} else if (cmd === 'create') {
    var age = process.argv[3];
    var kind = process.argv[4];
    var name = process.argv[5];

    if (!isNaN(age) && kind && name) {
        fs.readFile(petsPath, 'utf8', function(err, data) {
            if (err) {
                throw err;
            }
            var pets = JSON.parse(data);
            var newPet = {
                age: parseInt(age),
                kind: kind,
                name: name
            }

            pets.push(newPet);
            var petsJSON = JSON.stringify(pets);

            fs.writeFile(petsPath, petsJSON, function(writeErr) {
                if (writeErr) {
                    throw writeErr;
                }
            })
            console.log(newPet);
        })
    } else {
        console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
        process.exit(1);
    }
} else if (cmd === 'update') {
    var index = process.argv[3];
    var age = process.argv[4];
    var kind = process.argv[5];
    var name = process.argv[6];

    if (!isNaN(index) && !isNaN(age) && kind && name) {
        fs.readFile(petsPath, 'utf8', function(err, data) {
            if (err) {
                throw err;
            }
            var pets = JSON.parse(data);
            var updatePet = {
                age: parseInt(age),
                kind: kind,
                name: name
            }

            // pets.slice(index, 1, updatePet)
            pets[index] = updatePet;
            var petsJSON = JSON.stringify(pets);

            fs.writeFile(petsPath, petsJSON, function(writeErr) {
                if (writeErr) {
                    throw writeErr;
                }
            })
            console.log(updatePet);
        })
    } else {
        console.error(`Usage: ${node} ${file} update INDEX AGE KIND NAME`);
        process.exit(1);
    }
} else if (cmd === 'destroy') {
    fs.readFile(petsPath, 'utf8', function(err, data) {
            var index = process.argv[3];
            var pets = JSON.parse(data);
            if (isNaN(index) || index >= pets.length) {
                console.error(`Usage: ${node} ${file} destroy INDEX`);
                process.exit(1);
            } else {
                if (err) {
                    throw err;
                }

                var pet = pets[index]

                pets.splice(index, 1);

                var petsJSON = JSON.stringify(pets);

                fs.writeFile(petsPath, petsJSON, function(writeErr) {
                    if (writeErr) {
                        throw writeErr;
                    }
                })
                console.log(pet);
            }
        })
    }
    else {
        console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
        process.exit(1);
    }
