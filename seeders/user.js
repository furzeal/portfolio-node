'use strict';

//подключаем модули
const mongoose = require('mongoose');
const readline = require('readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
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


//логин и пароль, изначально пустые
let login = '',
    password = '';

//спрашиваем логин
rl.question('Логин: ', answer => {
    //записываем введенный логин
    login = answer;

    //спрашиваем пароль
    rl.question('Пароль: ', answer => {
        //записываем введенный пароль
        password = answer;
        //завершаем ввод
        rl.close();
    });
});

//когда ввод будет завершен
rl.on('close', () => {
    //подключаем модель пользователя
    require('../models/user');

    //создаем экземпляр пользователя и указываем введенные данные
    const User = mongoose.model('user'),
        adminUser = new User({username: login, password: password});

    //пытаемся найти пользователя с таким логином
    User
        .findOne({username: login})
        .then(u => {
            //если такой пользователь уже есть - сообщаем об этом
            if (u) {
                throw new Error('Такой пользователь уже существует!');
            }

            //если нет - добавляем пользователя в базу
            return adminUser.save();
        })
        .then(u => console.log('ok!'), e => console.error(e.message))
        .then(() => process.exit(0));
});
