/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre customer feedback API for the customer feedback reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /channel-rating-by-month
 *
 * Fetches average customer feedback ratings by channel for a specified month.
 *
 * Example:
 * fetch('/channel-rating-by-month?month=1')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/channel-rating-by-month', (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return next(createError(400, 'month and channel are required'));
    }

    mongo (async db => {
      const data = await db.collection('customerFeedback').aggregate([
        {
          $addFields: {
            date: { $toDate: '$date' }
          }
        },
        {
          $group: {
            _id: {
              channel: "$channel",
              month: { $month: "$date" },
            },
            ratingAvg: { $avg: '$rating'}
          }
        },
        {
          $match: {
            '_id.month': Number(month)
          }
        },
        {
          $group: {
            _id: '$_id.channel',
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channel: '$_id',
            ratingAvg: 1
          }
        },
        {
          $group: {
            _id: null,
            channels: { $push: '$channel' },
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channels: 1,
            ratingAvg: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);

  } catch (err) {
    console.error('Error in /rating-by-date-range-and-channel', err);
    next(err);
  }
});

router.get('/salesperson', (req, res, next) => {
  try {
    mongo(async db => {
      const salespersons = await db.collection('customerFeedback').distinct('salesperson');
      res.send(salespersons);
    }, next);
  } catch (err) {
    console.error('An error occurred while retrieving a list of salespersons: ', err);
  }
});

router.get('/feedback-by-salesperson', (req, res, next) => {
  try {
    const salesperson = req.query.salesperson;

    if (!salesperson) {
      return next(createError(400, 'salesperson is required'));
    }

    mongo (async db => {
      const feedbackBySalespersonData = await db.collection('customerFeedback').aggregate([
        {
          $match: {
            salesperson: salesperson
          }
        },
        {
          $project: {
            _id: 1,
            region: 1,
            category: 1,
            salesperson: 1,
            customer: 1,
            feedbackType: 1,
            feedbackText: 1,
            feedbackSource: 1,
            feedbackStatus: 1
          }
        }
      ]).toArray();

      res.send(feedbackBySalespersonData);
    });
  } catch (err) {
    console.error('Error occurred while retrieving customer feedback by Salesperson data: ', err);
  }
});



module.exports = router;