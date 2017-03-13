const mongoose = require('mongoose');
const config = require('../config.json');

mongoose.Promise = global.Promise;
// mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
//     user: config.db.user,
//     pass: config.db.password
// }).catch(e => {
//     console.error(e);
//     throw e;
// });

mongoose.connect(config.connection.string);


// models
require('../models/skill');
let Model = mongoose.model('skill');

let item = new Model({
    group: "Frontend",
    items: [
        {name: "Html", value: 80},
        {name: "CSS", value: 50},
        {name: "JavaScript & jQuery", value: 50},
        {name: "WPF", value: 45},
    ]

});

item.save().then(
    i => {
        console.log('Запись успешно добавлена!');
    },
    e => {
        console.log('Ошибка при добавлении записи!');
        let error = Object.keys(e.errors)
            .map(key => e.errors[key].message)
            .join(', ');
    });


item = new Model({
    group: "Backend",
    items: [
        {name: "PHP & Laravel", value: 50},
        {name: "mySQL", value: 50},
        {name: "Node.js & npm", value: 20},
        {name: "Mongo.db", value: 40},
        {name: "C#", value: 60},
        {name: "SQL Server", value: 40},
    ]
});

item.save().then(
    i => {
        console.log('Запись успешно добавлена!');
    },
    e => {
        console.log('Ошибка при добавлении записи!');
        let error = Object.keys(e.errors)
            .map(key => e.errors[key].message)
            .join(', ');
    });


item = new Model({
    group: "Workflow",
    items: [
        {name: "Git", value: 70},
        {name: "Gulp", value: 70},
        {name: "Webpack", value: 20},
        {name: "Artisan", value: 50},
    ]
});

item.save().then(
    i => {
        console.log('Запись успешно добавлена!');
    },
    e => {
        console.log('Ошибка при добавлении записи!');
        let error = Object.keys(e.errors)
            .map(key => e.errors[key].message)
            .join(', ');
    })
    .then(() => process.exit(0)
    );

