const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Priority: Song Condition(Health_Mod) > Stage Condition(Health_Mod) > Mission Condition(Health_Mod)

const missionSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name_localized: {
    type: Map,
    of: String,
    required: true
  },
  description_localized: {
    type: Map,
    of: String
  },
  clear_comment_localized: [{
    type: Map,
    of: String
  }],
  background_color: String,
  text_light: {
    type: Boolean,
    default: false
  },
  priority: Number,
  play_conditions: {
    rating: {
      more_than: Number,
      less_than: Number
    }
  },
  set: {
    type: String,
    required: true
  },
  stage: Number,
  type: String,
  mission_health: Number,
  health_mod: {
    shiny_perfect: Number,
    perfect: Number,
    near: Number,
    miss: Number,
    end: Number
  },
  conditions: [{
    mission_health: {
      more_than: Number,
      less_than: Number
    },
    global_conditions: {
      score: {
        more_than: Number,
        less_than: Number
      },
      shiny_perfect_count: {
        more_than: Number,
        less_than: Number
      },
      perfect_count: {
        more_than: Number,
        less_than: Number
      },
      near_count: {
        more_than: Number,
        less_than: Number
      },
      miss_count: {
        more_than: Number,
        less_than: Number
      },
      health: {
        more_than: Number,
        less_than: Number
      },
      clear_type: {
        type: Array,
        of: Number
      }
    },
    stage_conditions: [{
      songs: [{
        id: String,
        difficulties: {
          type: Array,
          of: Number
        }
      }],
      score: {
        more_than: Number,
        less_than: Number
      },
      shiny_perfect_count: {
        more_than: Number,
        less_than: Number
      },
      perfect_count: {
        more_than: Number,
        less_than: Number
      },
      near_count: {
        more_than: Number,
        less_than: Number
      },
      miss_count: {
        more_than: Number,
        less_than: Number
      },
      health: {
        more_than: Number,
        less_than: Number
      },
      clear_type: {
        type: Array,
        of: Number
      }
    }]
  }],
  stages: [{
    random: Boolean,
    health_mod: {
      shiny_perfect: Number,
      perfect: Number,
      near: Number,
      miss: Number,
      end: Number
    },
    conditions: {
      score: {
        more_than: Number,
        less_than: Number
      },
      shiny_perfect_count: {
        more_than: Number,
        less_than: Number
      },
      perfect_count: {
        more_than: Number,
        less_than: Number
      },
      near_count: {
        more_than: Number,
        less_than: Number
      },
      miss_count: {
        more_than: Number,
        less_than: Number
      },
      health: {
        more_than: Number,
        less_than: Number
      },
      mission_health: {
        more_than: Number,
        less_than: Number
      },
      clear_type: {
        type: Array,
        of: Number
      }
    },
    songs: [{
      id: String,
      difficulties: {
        type: Array,
        of: Number
      },
      health_mod: {
        shiny_perfect: Number,
        perfect: Number,
        near: Number,
        miss: Number,
        end: Number
      },
      conditions: {
        score: {
          more_than: Number,
          less_than: Number
        },
        shiny_perfect_count: {
          more_than: Number,
          less_than: Number
        },
        perfect_count: {
          more_than: Number,
          less_than: Number
        },
        near_count: {
          more_than: Number,
          less_than: Number
        },
        miss_count: {
          more_than: Number,
          less_than: Number
        },
        health: {
          more_than: Number,
          less_than: Number
        },
        mission_health: {
          more_than: Number,
          less_than: Number
        },
        clear_type: {
          type: Array,
          of: Number
        }
      },
      open_conditions: {
        mission_health: {
          more_than: Number,
          less_than: Number
        },
        global_conditions: {
          score: {
            more_than: Number,
            less_than: Number
          },
          shiny_perfect_count: {
            more_than: Number,
            less_than: Number
          },
          perfect_count: {
            more_than: Number,
            less_than: Number
          },
          near_count: {
            more_than: Number,
            less_than: Number
          },
          miss_count: {
            more_than: Number,
            less_than: Number
          },
          health: {
            more_than: Number,
            less_than: Number
          },
          clear_type: {
            type: Array,
            of: Number
          }
        },
        stage_conditions: [{
          songs: [{
            id: String,
            difficulties: {
              type: Array,
              of: Number
            }
          }],
          score: {
            more_than: Number,
            less_than: Number
          },
          shiny_perfect_count: {
            more_than: Number,
            less_than: Number
          },
          perfect_count: {
            more_than: Number,
            less_than: Number
          },
          near_count: {
            more_than: Number,
            less_than: Number
          },
          miss_count: {
            more_than: Number,
            less_than: Number
          },
          health: {
            more_than: Number,
            less_than: Number
          },
          clear_type: {
            type: Array,
            of: Number
          }
        }]
      }
    }]
  }],
  cleared: [{
    user_code: Number,
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
      cleared: Boolean,
      mission_health: Number
    }],
    total: {
      score: Number,
      shiny_perfect_count: Number,
      perfect_count: Number,
      near_count: Number,
      miss_count: Number,
      mission_health: Number
    },
    mission_clear_type: Number,
    time_cleared: Date
  }]
})

module.exports = mongoose.model('mission', missionSchema)
