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
        {name: "Html", value: 70},
        {name: "CSS", value: 55},
        {name: "JS(ES6+)", value: 60},
        {name: "React/Redux", value: 40},
        {name: "WPF", value: 65},
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
        {name: "C#", value: 75},
        {name: "ASP.NET Core", value: 45},
        {name: "EF Core", value: 40},
        {name: "SQL", value: 50},
        {name: "MongoDB", value: 40},
        {name: "RESTful API", value: 65},
        {name: "PHP & Laravel", value: 40},
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
        {name: "Gulp", value: 55},
        {name: "Webpack", value: 60},
        {name: "NuGet", value: 80},
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

