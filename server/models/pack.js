const mongoose = require('mongoose')
const Schema = mongoose.Schema

const packSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  plus_character: Number,
  custom_banner: Boolean,
  name_localized: {
    type: Map,
    of: String
  },
  description_localized: {
    type: Map,
    of: String
  }
})

module.exports = mongoose.model('pack', packSchema)
