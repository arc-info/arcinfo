const mongoose = require('mongoose')
const Schema = mongoose.Schema

const songSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title_localized: {
    type: Map,
    of: String
  },
  artist: String,
  bpm: String,
  bpm_base: Number,
  set: String,
  purchase: String,
  side: Number,
  bg: String,
  remote_dl: Boolean,
  world_unlock: Boolean,
  date: Date,
  difficulties: [{
    ratingClass: Number,
    chartDesigner: String,
    jacketDesigner: String,
    rating: Number,
    detailed_rating: Number,
    noteNumber: Number
  }]
})

module.exports = mongoose.model('song', songSchema)
