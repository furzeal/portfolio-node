'use strict';

const mongoose = require('mongoose');
const skillSchema = new mongoose.Schema({
    group: {
        type: String,
    },
    items: {
        type:[{
            name:{
                type:String
            },
            value: {
                type:Number,
                default:0
            }
        }]
    }
});

mongoose.model('skill',skillSchema);
