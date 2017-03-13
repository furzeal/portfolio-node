const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// models
require('../../models/work');

router.get('/', function (req, res) {
    // var obj = [];
    // const Model = mongoose.model('work');
    // Model.find({}, function (err, records) {
    //     records.forEach(function (work, i) {
    //         obj.push({
    //             name: work.name,
    //             technologies: work.technologies,
    //             link: work.link,
    //             image: work.image,
    //         });
    //     });
    //     console.log(obj);
    //     res.json({
    //         works: obj
    //     });
    // });

    var obj = {};
    const Model = mongoose.model('work');
    Model.find().then(works => {
        Object.assign(obj,works);
        console.log(obj);
        res.json(obj);
    });
});

module.exports = router;
