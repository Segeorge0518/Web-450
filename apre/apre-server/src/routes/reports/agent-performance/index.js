/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre agent performance API for the agent performance reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /call-duration-by-date-range
 *
 * Fetches call duration data for agents within a specified date range.
 *
 * Example:
 * fetch('/call-duration-by-date-range?startDate=2023-01-01&endDate=2023-01-31')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/call-duration-by-date-range', (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return next(createError(400, 'Start date and end date are required'));
    }

    console.log('Fetching call duration report for date range:', startDate, endDate);

    mongo(async db => {
      const data = await db.collection('agentPerformance').aggregate([
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $lookup: {
            from: 'agents',
            localField: 'agentId',
            foreignField: 'agentId',
            as: 'agentDetails'
          }
        },
        {
          $unwind: '$agentDetails'
        },
        {
          $group: {
            _id: '$agentDetails.name',
            totalCallDuration: { $sum: '$callDuration' }
          }
        },
        {
          $project: {
            _id: 0,
            agent: '$_id',
            callDuration: '$totalCallDuration'
          }
        },
        {
          $group: {
            _id: null,
            agents: { $push: '$agent' },
            callDurations: { $push: '$callDuration' }
          }
        },
        {
          $project: {
            _id: 0,
            agents: 1,
            callDurations: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);
  } catch (err) {
    console.error('Error in /call-duration-by-date-range', err);
    next(err);
  }
});

router.get('/team', (req, res, next) => {
  try {
    mongo (async db => {
      const team = await db.collection('agentPerformance').distinct('team');
      res.send(teams);
    }, next);
  } catch (err) {
    console.error('Error getting teams: ', err);
    next(err);
  }
});


router.get('/performanceByYear', (req, res, next) => {
  try {
    const year = req.query.year;

    if (!year) {
      return res.status(400).send('Year parameter is missing');
    }

    mongo(async db => {
      // Project year for debug
      const debug = await db.collection('agentPerformance').aggregate([
        { $project: { year: { $year: "$date" }, agentId: 1 } }
      ]).toArray();
      console.log('Year projection:', debug);

      const performanceByYear = await db.collection('agentPerformance').aggregate([
        {
          $match: {
            $expr: {
              $eq: [ { $year: '$date' }, Number(year) ]
            }
          }
        },
        {
          $project: {
            _id: 0,
            agentId: 1,
            region: 1,
            team: 1,
            performanceMetrics: 1,
            customerFeedback: 1,
            callDuration: 1,
            resolutionTime: 1
          }
        }
      ]).toArray();

      res.json(performanceByYear);
    }, next);

  } catch (err) {
    console.error('Could not get requested data: ', err);
    next(err);
  }
});

module.exports = router;

