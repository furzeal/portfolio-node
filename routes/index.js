const express = require('express');
const router = express.Router();
router.get('/', function (req, res) {
    var obj = {title: "Сайт-портфолио Максима Шаталова", isAuth:false};
    res.render('pages/index', obj);
});
router.get('/auth', function (req, res) {
    var obj = {title: "Авторизация", isAuth:true};
    res.render('pages/index', obj);
});

module.exports = router;