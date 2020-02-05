const express = require('express')
const router = express.Router()
const Character = require('../models/character')

/* GET All Characters. */
router.get('/', function (req, res, next) {
  Character.find({}, function (err, chars) {
    if (err) {
      res.send({
        success: false,
        error_code: err
      })
    }
    const map = {}

    chars.forEach((char) => {
      map[char.get('id')] = char
    })
    res.send({
      success: true,
      value: map
    })
  })
})

module.exports = router
