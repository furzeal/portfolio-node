const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// blog
router.get('/', function (req, res) {
    var obj = {title: "Блог"};
    const Model = mongoose.model('blog');
    Model.find().then(articles => {
        Object.assign(obj,{articles:articles});
        res.render('pages/blog', obj);
    });
});

module.exports = router;

