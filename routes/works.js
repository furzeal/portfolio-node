const express = require('express');
const router = express.Router();
const config = require('../config.json');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const mongoose = require('mongoose');

// models
require('../models/work');

router.get('/', function (req, res) {
    let obj = {title: "Мои работы"};
    const Model = mongoose.model('work');
    Model.find().then(works => {
        Object.assign(obj,{works:works});
        res.render('pages/works', obj);
    });
});

router.post('/', function (req, res) {
    //требуем наличия имени, обратной почты и текста
    if (!req.body.username) return res.json({status: 'Вы забыли указать свое имя!'});
    if (!req.body.email) return res.json({status: 'Вы забыли указать свой email!'});
    if (!req.body.message) return res.json({status: 'Веведите сообщение!'});

    //инициализируем модуль для отправки писем и указываем данные из конфига
    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: config.mail.user,
            pass: config.mail.pass
        }
    }));
    console.log(req.body.email);
    const mailOptions = {
        from: req.body.email,
        to: config.mail.user,
        subject: config.mail.subject,
        text: req
            .body
            .message
            .trim()
            .slice(0, 500)
    };

//отправляем почту
    transporter.sendMail(mailOptions, function (error, info) {
        //если есть ошибки при отправке - сообщаем об этом
        if (error) {
            console.log(error);
            return res.json({status: 'При отправке письма произошла ошибка'});
        }
        res.json({status: 'Письмо успешно отправлено'});
    });
});

module.exports = router;