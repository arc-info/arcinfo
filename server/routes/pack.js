const express = require('express')
const router = express.Router()
const Pack = require('../models/pack')

/* GET All Packs. */
router.get('/', function (req, res, next) {
  Pack.find({}, function (err, packs) {
    if (err) {
      res.send({
        success: false,
        error_code: err
      })
    }
    const map = {}

    packs.forEach((pack) => {
      map[pack.get('id')] = pack
    })
    res.send({
      success: true,
      value: map
    })
  })
})

module.exports = router
