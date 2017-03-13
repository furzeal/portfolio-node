const express = require('express');
const router = express.Router();
//const config = require('../../config.json');
const mongoose = require('mongoose');

// models
require('../../models/skill');

router.post('/', function (req, res) {
    let Model = mongoose.model('skill');
    let models = [];
    console.log(req.body);
    Object.keys(req.body).map(group => ({
        group: group,
        items: Object.keys(req.body[group]).map(i => ({
            name: i,
            value: req.body[group][i]
        }))
    })).forEach(toSave => models.push(new Model(toSave)));

    if (models.filter(m => m.validateSync()).length) {
        return res.json({error: 'Не удалось сохранить данные', status: 'Не удалось сохранить данные'})
    }

    Model.remove({}).then(() =>
        Model.insertMany(models).then(() =>
            res.json({status: 'Данные сохранены!'})
        ));
});

module.exports = router;