const mongoose = require('mongoose')
const Schema = mongoose.Schema

const worldMapSchema = new Schema({
  map_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  is_legacy: Boolean,
  chapter: Number,
  available_from: Date,
  available_to: Date,
  is_repeatable: Boolean,
  require_id: String,
  require_type: String,
  coordinate: String,
  step_count: Number,
  custom_bg: String,
  stamina_cost: Number,
  steps: [{
    position: Number,
    capture: Number,
    restrict_id: String,
    restrict_type: String,
    items: [{
      type: String,
      id: String,
      amount: Number
    }],
    plus_stamina_value: Number
  }],
  rewards: [{
    items: [{
      type: String,
      id: String,
      amount: Number
    }],
    position: Number
  }]
})

module.exports = mongoose.model('map', worldMapSchema)
