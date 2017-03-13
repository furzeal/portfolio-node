const express = require('express');
const router = express.Router();
router.get('/', function (req, res) {
    var obj = {title: "Главная страница", isAuth:false};
    res.render('pages/index', obj);
});
router.get('/auth', function (req, res) {
    var obj = {title: "Г222лавная страница", isAuth:true};
    res.render('pages/index', obj);
});

module.exports = router;