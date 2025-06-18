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


// This endpoint retrieves agent performance data for a specific year.
router.get('/performanceByYear', (req, res, next) => {
  try {
    // Extract the 'year' query parameter from the request
    const year = req.query.year;

    // If no year is provided, return a 400 Bad Request error
    if (!year) {
      return res.status(400).send('Year parameter is missing');
    }

    // Use the 'mongo' helper to perform database operations
    mongo(async db => {
      // Debug: Project the year from each document's 'date' field for verification
      const debug = await db.collection('agentPerformance').aggregate([
        { $project: { year: { $year: "$date" }, agentId: 1 } }
      ]).toArray();
      // Log the projected year values for debugging purposes
      console.log('Year projection:', debug);

      // Aggregate agent performance documents that match the requested year
      const performanceByYear = await db.collection('agentPerformance').aggregate([
        {
          // Match documents where the year part of 'date' equals the requested year
          $match: {
            $expr: {
              $eq: [ { $year: '$date' }, Number(year) ]
            }
          }
        },
        {
          // Project only the relevant fields, exclude '_id'
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

      // Respond with the filtered performance data in JSON format
      res.json(performanceByYear);
    }, next);

  } catch (err) {
    // Handle any unexpected errors
    console.error('Could not get requested data: ', err);
    next(err);
  }
});

module.exports = router;

