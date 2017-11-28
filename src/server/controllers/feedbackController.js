"use strict";

var async = require('async');
var nconf = require('nconf');
var _ = require('lodash');
var Feedback = require('../database/feedback');
var utils = require('../utils');

var feedbackController = module.exports;

feedbackController.get = function (req, res, next) {

    Feedback.findById(req.params.uuid, function (err, data) {
        if (err) return next(err);

        return res.json({code: 200, msg: data});
    });
};

feedbackController.create = function (req, res, next) {

    if (!req.body.feedback) return res.json({code: 9001, msg: 'no feedback'});
    try {
        var fdres = JSON.parse(req.body.feedback);

        var feedback = {
            class: req.params.classid,
            email: req.body.email,
            feedback: fdres.map(function (item) {
                return ({uuid: item.id, content:item.content});
            })
        };

        Feedback.create(feedback, function (err, data) {
            if (err) return next(err);

            return res.json({code: 200, msg: 'success submit'});
        });
    } catch (err) {
        if (err) return next(err);
    }
};

feedbackController.delete = function (req, res, next) {
    var condition = {id: req.params.id};

    Feedback.delete(condition, function (err, data) {
        if (err) return next(err);

        return res.json({code: 200, msg: 'success delete'});
    });
};

feedbackController.list = function (req, res, next) {
    var csid = req.params.csid || '';

    var condition = getCondition(csid);

    var order = [['class', 'ASC']];
    if (req.query.sortField) order = [[req.query.sortField, req.query.sortOrder === 'ascend' ? 'ASC' : 'DESC']];

    Feedback.listAndCount(condition, order, function (err, data) {
        if (err) return next(err);

        return res.json({code: 200, msg: data});
    });
};