const express = require('express')
const router = express.Router()
const WorldMap = require('../models/world_map')

/* GET All Maps. */
router.get('/', function (req, res, next) {
  WorldMap.find({}, function (err, worldMaps) {
    if (err) {
      res.send({
        success: false,
        error_code: err
      })
    }
    const map = {}

    worldMaps.forEach((worldMap) => {
      map[worldMap.get('map_id')] = worldMap
    })
    res.send({
      success: true,
      value: map
    })
  })
})

module.exports = router
