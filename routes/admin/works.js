const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const mongoose = require('mongoose');


// models
require('../../models/work');

router.post('/', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = config.upload;
    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.json({status: 'Не удалось загрузить картинку'});
        }
        if (!fields.name) {
            return res.json({status: 'Не указано описание картинки'});
        }

        let Model = mongoose.model('work');

        fs
            .rename(files.image.path, path.join(config.upload, files.image.name), function (err) {
                if (err) {
                    fs.unlink(path.join(config.upload, files.image.name));
                    fs.rename(files.image.path, files.image.name);
                }
                let dir = config.upload.substr(config.upload.indexOf('/'));

                console.log(files);

                let item = new Model({
                    name: fields.name,
                    technologies: fields.technologies,
                    link: fields.link,
                });
                item.save().then(pic => {
                    Model.update({_id: pic._id}, {$set: {image: path.join(dir, files.image.name)}}, {upsert: true})
                        .then(
                            i => res.json({status: 'Картинка успешно загружена'}),
                            e => res.json({status: e.message})
                        );
                });
            });
    });
});

module.exports = router;