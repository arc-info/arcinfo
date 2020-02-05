const express = require('express')
const router = express.Router()
const Song = require('../models/song')

/* GET All Songs. */
router.get('/', function (req, res, next) {
  Song.find({}, function (err, songs) {
    if (err) {
      res.send({
        success: false,
        error_code: err
      })
    }
    if (Object.prototype.hasOwnProperty.call(req.query, 'raw') && req.query.raw) {
      res.send({
        success: true,
        value: songs
      })
    } else {
      const map = {}

      songs.forEach((song) => {
        map[song.get('id')] = song
      })
      res.send({
        success: true,
        value: map
      })
    }
  })
})

module.exports = router
