const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userInfoSchema = new Schema({
  user_id: { type: Number, required: true, unique: true, index: true },
  user_code: { type: Number, required: true, unique: true, index: true },
  recent_update: Date,
  character: Number,
  is_char_uncapped: Boolean,
  is_skill_sealed: Boolean,
  join_date: Date,
  name: String,
  rating: Number,
  rating_records: [{
    timestamp: Date,
    rating: Number
  }],
  recent_score: [{
    best_clear_type: Number,
    clear_type: Number,
    difficulty: Number,
    health: Number,
    miss_count: Number,
    modifier: Number,
    near_count: Number,
    perfect_count: Number,
    rating: Number,
    score: Number,
    shiny_perfect_count: Number,
    song_id: String,
    time_played: Date
  }],
  best_score: [{
    best_clear_type: Number,
    clear_type: Number,
    difficulty: Number,
    health: Number,
    miss_count: Number,
    modifier: Number,
    near_count: Number,
    perfect_count: Number,
    rating: Number,
    score: Number,
    shiny_perfect_count: Number,
    song_id: String,
    time_played: Date
  }],
  arcinfo: {
    missions: {
      cleared: {
        type: Map,
        of: Schema.Types.Mixed
      },
      playing: {
        id: String,
        stage: Number,
        records: [{
          song_id: String,
          difficulty: Number,
          score: Number,
          shiny_perfect_count: Number,
          perfect_count: Number,
          near_count: Number,
          miss_count: Number,
          clear_type: Number,
          health: Number,
          mission_health: Number,
          cleared: Boolean
        }],
        target_songs: [{
          song_id: String,
          difficulties: {
            type: Array,
            of: Number
          }
        }],
        time_stage_started: Date,
        failed: Boolean,
        cleared: Boolean
      }
    }
  }
})

module.exports = mongoose.model('user_info', userInfoSchema)
