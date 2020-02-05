const express = require('express')
const router = express.Router()
const Mission = require('../models/mission')
const MissionPack = require('../models/missionpack')

/* GET All Missions. */
router.get('/', function (req, res, next) {
  Mission.find({}, { cleared: false }, function (err, missions) {
    if (err) {
      res.send({
        success: false,
        error_code: err
      })
    }
    if (Object.prototype.hasOwnProperty.call(req.query, 'raw') && req.query.raw) {
      res.send({
        success: true,
        value: missions
      })
    } else {
      const map = {}

      missions.forEach((mission) => {
        map[mission.get('id')] = mission
      })
      res.send({
        success: true,
        value: map
      })
    }
  })
})

router.get('/packs', function (req, res, next) {
  MissionPack.find({}, function (err, missionPacks) {
    if (err) {
      res.send({
        success: false,
        error_code: err
      })
    }
    if (Object.prototype.hasOwnProperty.call(req.query, 'raw') && req.query.raw) {
      res.send({
        success: true,
        value: missionPacks
      })
    } else {
      const map = {}

      missionPacks.forEach((missionPack) => {
        map[missionPack.get('id')] = missionPack
      })
      res.send({
        success: true,
        value: map
      })
    }
  })
})

router.get('/rank/all/:id', function (req, res, next) {
  const option = req.query
  let limit = 100
  if (!isNaN(option.limit)) { limit = option.limit }
  let skip = 0
  if (!isNaN(option.skip)) { skip = option.skip }
  Mission.aggregate([
    { $match: { id: req.params.id } },
    { $unwind: '$cleared' },
    {
      $sort: {
        'cleared.total.score': -1
      }
    },
    {
      $group: {
        cleared: {
          $push: '$cleared'
        },
        _id: 1
      }
    },
    {
      $project: {
        size: { $size: '$cleared' },
        cleared: { $slice: ['$cleared', skip * 1, limit * 1] },
        _id: 0
      }
    }
  ]).then((docs) => {
    res.send({
      success: true,
      value: docs
    })
  }).catch((reason) => {
    res.send({
      success: false,
      error_code: reason
    })
  })
})

router.get('/rank/user/:code/:id', function (req, res, next) {
  Mission.aggregate([
    { $match: { id: req.params.id } },
    { $unwind: '$cleared' },
    {
      $sort: {
        'cleared.total.score': -1
      }
    },
    {
      $group: {
        cleared: {
          $push: '$cleared'
        },
        _id: 1
      }
    },
    { $unwind: { path: '$cleared', includeArrayIndex: 'cleared.array_index' } },
    {
      $match: { 'cleared.user_code': req.params.code * 1 }
    },
    {
      $project: {
        cleared: 1,
        _id: 0
      }
    }
  ]).then((docs) => {
    res.send({
      success: true,
      value: docs
    })
  }).catch((reason) => {
    res.send({
      success: false,
      error_code: reason
    })
  })
})

module.exports = router
