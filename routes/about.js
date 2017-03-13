const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// models
require('../models/skill');

router.get('/', function (req, res) {
    var obj = {title: "Обо мне"};
    const Model = mongoose.model('skill');
    Model.find().then(skills => {
        Object.assign(obj,{skills:skills});
        res.render('pages/about', obj);
    });
});

module.exports = router;

