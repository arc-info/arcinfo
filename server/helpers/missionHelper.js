/* eslint-disable object-shorthand */
const Mission = require('../models/mission')
const MissionPack = require('../models/missionpack')
const queryWorker = require('../workers/query_worker')

const helper = {
  isPlaying (user) {
    const missionData = user.arcinfo.missions.playing
    if (
      Object.prototype.hasOwnProperty.call(missionData, 'id') &&
      (typeof missionData.id) === 'string' &&
      missionData.failed !== true &&
      missionData.cleared !== true &&
      (Date.now() - (new Date(missionData.time_stage_started).getTime())) < 3.55 * 60000
    ) {
      return true
    }
    return false
  },
  async isPlayable (user, mission) {
    if (Object.prototype.hasOwnProperty.call(mission, 'play_conditions')) {
      for (const [index, condition] of Object.entries(mission.play_conditions)) {
        switch (index) {
          case 'rating':
            if (!this.isInRange(condition, user.rating)) { return false }
        }
      }
    }
    const missionPack = await MissionPack.findOne({ id: mission.set })
    if ((Object.prototype.hasOwnProperty.call(missionPack, 'time_start') && missionPack.time_start.getTime() > Date.now()) || (Object.prototype.hasOwnProperty.call(missionPack, 'time_expire') && missionPack.time_expire.getTime() < Date.now())) {
      return false
    }
    return true
  },
  play (user, mission) {
    const mData = user.arcinfo.missions.playing
    mData.id = mission.id
    mData.stage = 0
    mData.records = []
    mData.failed = false
    mData.cleared = false
    mData.time_stage_started = Date.now()
    mData.target_songs = []
    for (const song of mission.stages[0].songs) {
      mData.target_songs.push({
        song_id: song.id,
        difficulties: song.difficulties
      })
    }
    user.save()
    return user
  },
  async checkResult (user, mission) {
    console.log('Checking ' + user.name)
    const mData = user.arcinfo.missions.playing
    const failed = function () {
      mData.failed = true
      user.save()
      // console.log(user.name + ' Failed.')
    }
    // Time Limit Check
    if ((Date.now() - (new Date(mData.time_stage_started).getTime())) > 3.55 * 60000) {
      // console.log('Checking Time Limit...')
      failed()
      return false
    }

    // Update from lowo server
    const userUpdateReq = await queryWorker.get_user_info(user.user_code, false)

    // Update check
    if (!userUpdateReq.success) {
      // console.log('Checking Update Success...')
      failed()
      return false
    }
    const updatedUser = userUpdateReq.value
    // Recent Record Existance Check
    if (updatedUser.recent_score.length !== 1) {
      // console.log('Checking Recent Record Existance...')
      failed()
      return false
    }
    user.recent_score = updatedUser.recent_score
    const recent = updatedUser.recent_score[0]

    // Recent Record Time Check
    if ((new Date(recent.time_played).getTime() - new Date(mData.time_stage_started).getTime()) < 0) {
      // console.log('Checking Recent Record Time...')
      failed()
      return false
    }

    // Target Song Check
    let targetSongs = mData.target_songs
    const playedSong = targetSongs.find((song) => {
      return (song.song_id === recent.song_id ||
        (song.difficulties.length > 0 &&
        song.difficulties.includes(recent.difficulty))
      )
    })

    if (playedSong === undefined) {
      // console.log('Checking Recent Song is Target...')
      failed()
      return false
    }

    const stageLen = mission.stage
    let currStage = mData.stage
    const stageData = mission.stages[currStage]
    const playedSongData = stageData.songs.find((song) => {
      return song.id === recent.song_id
    })
    // console.log('Data of Played Song: ' + playedSongData)
    if (playedSongData === undefined) {
      // console.log('Checking Recent Song is Target...')
      failed()
      return false
    }

    // console.log('Data of Stage: ' + stageData)
    const mType = mission.type
    const records = mData.records
    let conditions = playedSongData.conditions
    const recentCopied = Object.assign({}, recent)
    recentCopied.cleared = false
    // Check player is cleared.
    const isVaildHealthMod = function (healthMod) {
      const modList = ['shiny_perfect', 'perfect', 'near', 'miss', 'end']
      for (const [index, mod] of Object.entries(healthMod)) {
        if (modList.includes(index) && !isNaN(mod)) {
          return true
        }
      }
      return false
    }
    // Health
    let newHealth = 0
    if (mType === 'health') {
      // console.log('Mission Type Detected: HEALTH')
      let health = mission.mission_health
      if (currStage > 0) { health = records[currStage - 1].mission_health }
      let healthMod = playedSongData.health_mod
      // console.log(healthMod)
      if (!isVaildHealthMod(healthMod)) {
        healthMod = isVaildHealthMod(stageData.health_mod) ? stageData.health_mod : mission.health_mod
      }
      newHealth = this.calcHealth(recent, healthMod, health, mission.mission_health)
      recentCopied.mission_health = newHealth

      // Health Condition Check
      conditions = stageData.conditions
      if (conditions !== undefined && conditions.mission_health !== undefined) {
        // console.log('Checking Stage Health Conditions...')
        if (!this.isInRange(conditions.mission_health, newHealth)) {
          records.push(recentCopied)
          failed()
          return false
        }
      }

      // Death Check
      if (newHealth <= 0 || recent.health < 0) {
        // console.log('Checking Player is Dead...')
        records.push(recentCopied)
        failed()
        return false
      }

    // Conditions
    } else {
      // console.log('Mission Type Detected: CONDITIONS')
      // If Song Condition is exist
      let hasSongCondition = false
      if (conditions !== undefined) {
        // console.log('Checking Song Conditions...')
        for (const [index, condition] of Object.entries(conditions)) {
          if (index !== 'clear_type' || (index === 'clear_type' && condition.length > 0)) {
            hasSongCondition = true
          }
          if (!this.conditionCheck(index, condition, recent)) {
            records.push(recentCopied)
            failed()
            return false
          }
        }
      }
      conditions = stageData.conditions
      // If Song Condition isn't exist, then Check Stage Condition
      if (conditions !== undefined && !hasSongCondition) {
        // console.log('Checking Stage Conditions...')
        for (const [index, condition] of Object.entries(conditions)) {
          if (!this.conditionCheck(index, condition, recent)) {
            records.push(recentCopied)
            failed()
            return false
          }
        }
      }
    }
    // After Cleared Operation

    // Push Record
    recentCopied.cleared = true
    records.push(recentCopied)

    // Last Stage Check
    if (currStage + 1 >= stageLen) {
      // console.log('Last Stage Detected')
      // console.log('Creating Total Results...')
      const total = {
        score: 0,
        shiny_perfect_count: 0,
        perfect_count: 0,
        near_count: 0,
        miss_count: 0
      }
      if (mType === 'health') { total.mission_health = 0 }
      for (const record of records) {
        total.score += record.score
        total.shiny_perfect_count += record.shiny_perfect_count
        total.perfect_count += record.perfect_count
        total.near_count += record.near_count
        total.miss_count += record.miss_count
        if (mType === 'health') { total.mission_health = record.mission_health }
      }
      const clearedData = {
        user_code: user.user_code,
        records: records,
        total: total,
        mission_clear_type: 0,
        time_cleared: Date.now()
      }

      // Total Clear Condition Check
      if (mission.conditions !== undefined && mission.conditions.length > 0) {
        for (const [index, conditions] of mission.conditions.entries()) {
          let isCleared = true
          console.log('Check ' + index + ' Conditions...')
          if (mType === 'health') {
            if (conditions.mission_health !== undefined) {
              if (!this.isInRange(conditions.mission_health, newHealth)) {
                isCleared = false
                console.log('health failed.')
              }
            }
          }
          // Checking Global Conditions
          if (conditions.global_conditions !== undefined) {
            for (const [index, condition] of Object.entries(conditions.global_conditions)) {
              if (!this.conditionCheck(index, condition, total)) {
                isCleared = false
                console.log('global failed')
                break
              }
            }
          }

          // Checking Stage Conditions
          if (isCleared && conditions.stage_conditions !== undefined && conditions.stage_conditions.length > 0) {
            conditions.stage_conditions.forEach((conditions, stageIndex) => {
              for (const [index, condition] of Object.entries(conditions)) {
                if (!this.conditionCheck(index, condition, records[stageIndex])) {
                  isCleared = false
                  console.log('stage failed')
                  break
                }
              }
            })
          }
          if (isCleared) { clearedData.mission_clear_type = index }
          if (index === 0 && !isCleared) {
            console.log('first clear conditions failed.')
            failed()
            return false
          }
        }
      }
      let cleared = user.arcinfo.missions.cleared
      if (cleared === undefined || cleared === null) {
        user.arcinfo.missions.cleared = {}
        cleared = user.arcinfo.missions.cleared
      }
      mData.cleared = true
      // console.log(user.name + ' Mission Cleared.')
      // If new record
      if ((Object.prototype.hasOwnProperty.call(cleared, mission.id) && clearedData.total.score > cleared[mission.id].total.score) || !Object.prototype.hasOwnProperty.call(cleared, mission.id)) {
        // console.log('New Record')
        cleared.set(mission.id, clearedData)
        Mission.findOne({ id: mission.id, 'cleared.user_code': user.user_code }, (err, doc) => {
          if (err) {
            console.log(err)
          }
          if (doc === null) {
            Mission.findOneAndUpdate({ id: mission.id }, {
              $push: {
                cleared: clearedData
              }
            }, { upsert: true }, (err) => {
              if (err) {
                console.log(err)
              }
            })
          } else {
            Mission.findOneAndUpdate({ id: mission.id, 'cleared.user_code': user.user_code }, {
              $set: {
                'cleared.$.records': clearedData.records,
                'cleared.$.total': clearedData.total,
                'cleared.$.mission_clear_type': clearedData.mission_clear_type,
                'cleared.$.time_cleared': clearedData.time_cleared
              }
            }, { upsert: true }, (err) => {
              if (err) {
                console.log(err)
              }
            })
          }
        })
      }

      user.save()
      return user
    }
    // console.log(user.name + ' Stage Cleared.')
    // Add Stage
    currStage = currStage + 1
    // console.log("Checking Stage " + currStage + " Target Songs...")
    const nextSongs = mission.stages[currStage].songs
    // Update Target Songs
    targetSongs = []
    for (const song of nextSongs) {
      if (song.open_conditions !== undefined) {
        if (mType === 'health' &&
        song.open_conditions.mission_health !== undefined &&
        this.isInRange(conditions.mission_health, newHealth)) {
          targetSongs.push({
            song_id: song.id,
            difficulties: song.difficulties
          })
        } else {
          // Collection Total Result at this point
          const total = {
            score: 0,
            shiny_perfect_count: 0,
            perfect_count: 0,
            near_count: 0,
            miss_count: 0
          }
          if (mType === 'health') { total.mission_health = 0 }
          for (const record of records) {
            total.score += record.score
            total.shiny_perfect_count += record.shiny_perfect_count
            total.perfect_count += record.perfect_count
            total.near_count += record.near_count
            total.miss_count += record.miss_count
            if (mType === 'health') { total.mission_health += record.mission_health }
          }
          let isOpen = true
          // Checking Global Conditions
          if (song.open_conditions.global_conditions !== undefined) {
            for (const [index, condition] of Object.entries(song.open_conditions.global_conditions)) {
              if (!this.conditionCheck(index, condition, total)) {
                isOpen = false
                break
              }
            }
          }

          // Checking Stage Conditions
          if (isOpen && song.open_conditions.stage_conditions !== undefined && song.open_conditions.stage_conditions.length > 0) {
            song.open_conditions.stage_conditions.forEach((stageConditions, stageIndex) => {
              for (const [index, condition] of Object.entries(stageConditions)) {
                if (!this.conditionCheck(index, condition, records[stageIndex])) {
                  isOpen = false
                  break
                }
              }
            })
          }
          if (isOpen) {
            targetSongs.push({
              song_id: song.id,
              difficulties: song.difficulties
            })
          }
        }
      } else {
        targetSongs.push({
          song_id: song.id,
          difficulties: song.difficulties
        })
      }
    }

    // Remove other songs when random is on.
    if (mission.stages[currStage].random === true) {
      targetSongs = [
        targetSongs[[Math.floor(Math.random() * targetSongs.length)]]
      ]
    }
    mData.stage = currStage
    mData.target_songs = targetSongs
    mData.time_stage_started = Date.now()
    user.save()
    return user
  },
  isInRange (rangeObj, number) {
    const more = !isNaN(rangeObj.more_than) ? rangeObj.more_than : -1
    const less = !isNaN(rangeObj.less_than) ? rangeObj.less_than : Infinity
    const num = !isNaN(number) ? number : 0
    if (more > less) {
      return (num >= more || num <= less)
    }
    return (num >= more && num <= less)
  },
  calcHealth (recent, healthMod, health, maxHealth) {
    const shinyPerfect = isNaN(healthMod.shiny_perfect) ? 0 : healthMod.shiny_perfect
    const perfect = isNaN(healthMod.perfect) ? 0 : healthMod.perfect
    const near = isNaN(healthMod.near) ? 0 : healthMod.near
    const miss = isNaN(healthMod.miss) ? 0 : healthMod.miss
    const end = isNaN(healthMod.end) ? 0 : healthMod.end
    let newHealth = health + shinyPerfect * recent.shiny_perfect_count
    newHealth += perfect * recent.perfect_count
    newHealth += near * recent.near_count
    newHealth += miss * recent.miss_count
    if (newHealth > 0) { newHealth += end }
    return Math.min(newHealth, maxHealth)
  },
  conditionCheck (index, condition, record) {
    const numberType = ['score', 'shiny_perfect_count', 'perfect_count', 'near_count', 'miss_count', 'health']
    const arrayType = ['clear_type']
    const songsType = ['songs']

    if (numberType.includes(index)) {
      return this.isInRange(condition, record[index])
    }

    if (arrayType.includes(index)) {
      return (!(Array.isArray(condition) && condition.length > 0) || condition.includes(record[index]))
    }

    if (songsType.includes(index)) {
      return (condition.find((song) => {
        const songMatch = song.id === record.song_id
        const difficultyMatch = (song.difficulties !== undefined && song.difficulties.length > 0 && song.difficulties.includes(record.difficulty))
        return (!(Array.isArray(condition) && condition.length > 0) || (songMatch && difficultyMatch))
      }) !== undefined)
    }
    return true
  }
}

module.exports = helper
