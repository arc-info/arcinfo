const mongoose = require('mongoose')
const Schema = mongoose.Schema

const missionPackSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name_localized: {
    type: Map,
    of: String
  },
  description_localized: {
    type: Map,
    of: String
  },
  background_color: String,
  text_light: {
    type: Boolean,
    default: false
  },
  time_start: Date,
  time_expire: Date
})

module.exports = mongoose.model('mission_pack', missionPackSchema)
