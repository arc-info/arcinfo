/* eslint-disable prefer-promise-reject-errors */
const Queue = require('promise-queue')
const userinfo = require('../workers/query')
const maxConcurrent = 1
const maxQueue = Infinity
const queue = new Queue(maxConcurrent, maxQueue)
const Song = require('../models/song')

function calculateModifier (score) {
  let modifier = 0
  if (score > 10000000) {
    modifier = 2
  } else if (score > 9949999) {
    modifier = 1.5 + ((score - 9950000) / 100000)
  } else if (score > 9799999) {
    modifier = 1.0 + ((score - 9800000) / 400000)
  } else {
    modifier = ((score - 9500000) / 300000)
  }
  return modifier
}

module.exports = {
  get_user_info (userCode, includesBest) {
    userCode = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 9, useGrouping: false }).format(userCode).toString()
    return queue.add(function () {
      const friends = new Promise(function (resolve, reject) {
        userinfo.user_info(function (err, response, body) {
          if (err) {
            reject(err)
            return
          }
          if (!body.success) {
            reject(body.error_code)
            return
          }
          const promises = []
          for (const friend of body.value.friends) {
            promises.push(new Promise(function (resolve, reject) {
              userinfo.friend_del(friend.user_id, function (err, response, body) {
                if (err) {
                  reject(err)
                  return
                }
                resolve()
              })
            }))
          }
          Promise.all(promises).then(() => {
            resolve()
          })
        })
      })

      const addfriend = function () {
        return new Promise(function (resolve, reject) {
          userinfo.friend_add(userCode, function (err, response, body) {
            if (err) {
              reject(err)
              return
            }
            if (body.success === false) {
              reject(404)
              return
            }
            // console.log(body);
            const friend = body.value.friends[0]
            // console.log(friend.name + ' Added.');
            friend.user_code = userCode
            resolve(friend)
          })
        })
      }

      const getsonglist = function (friend) {
        return new Promise(function (resolve, reject) {
          Song.find({}).then((songs) => {
            resolve([friend, songs])
          })
        })
      }

      const getresults = function (data) {
        const friend = data[0]
        const songlist = data[1]
        // console.log("Collecting results...");
        return new Promise(function (resolve, reject) {
          const bestScore = []
          const promises = []
          songlist.forEach((song) => {
            if (friend.recent_score.length > 0 && friend.recent_score[0].song_id === song.id && friend.recent_score[0].score >= 9500000 && isNaN(song.difficulties[friend.recent_score[0].difficulty].detailed_rating)) {
              const changes = {}
              changes['difficulties.' + friend.recent_score[0].difficulty + '.detailed_rating'] = Math.round((friend.recent_score[0].rating - calculateModifier(friend.recent_score[0].score)) * 10) / 10
              Song.findOneAndUpdate({ id: song.id }, changes, { new: true, upsert: true }, function (error, doc) {
                if (error) { console.log(error) }
              })
              console.log('Updated detailed_rating of ' + song.id + ' to ' + Math.round((friend.recent_score[0].rating - calculateModifier(friend.recent_score[0].score)) * 10) / 10)
            }
            promises.push(new Promise(function (resolve, reject) {
              userinfo.rank_friend(song.id, 0, 0, 10, function (err, response, body) {
                if (err) {
                  reject(err)
                  return
                }
                if (!body.success) {
                  reject(body.error_code)
                  return
                }
                // console.log(song.id + ': ' + JSON.stringify(body))
                try {
                  if (body.value.length > 0) {
                    const dRating = song.difficulties[0].detailed_rating
                    if (!isNaN(dRating)) {
                      body.value[0].rating = Math.max(dRating + calculateModifier(body.value[0].score), 0)
                    }
                    bestScore.push(body.value[0])
                    if (isNaN(song.difficulties[0].noteNumber)) {
                      Song.findOneAndUpdate({ id: song.id }, { 'difficulties.0.noteNumber': (body.value[0].perfect_count + body.value[0].near_count + body.value[0].miss_count) }, { new: true, upsert: true }, function (error, doc) {
                        if (error) { console.log(error) }
                      })
                    }
                  }
                } catch (ex) {
                  reject(ex)
                  return
                }
                setTimeout(resolve, 1000)
              })
            }))
            promises.push(new Promise(function (resolve, reject) {
              userinfo.rank_friend(song.id, 1, 0, 10, function (err, response, body) {
                if (err) {
                  reject(err)
                  return
                }
                if (!body.success) {
                  reject(body.error_code)
                  return
                }
                try {
                  if (body.value.length > 0) {
                    const dRating = song.difficulties[1].detailed_rating
                    if (!isNaN(dRating)) {
                      body.value[0].rating = Math.max(dRating + calculateModifier(body.value[0].score), 0)
                    }
                    bestScore.push(body.value[0])
                    // console.log(song.id + ': ' + body)
                    if (isNaN(song.difficulties[1].noteNumber)) {
                      Song.findOneAndUpdate({ id: song.id }, { 'difficulties.1.noteNumber': (body.value[0].perfect_count + body.value[0].near_count + body.value[0].miss_count) }, { new: true, upsert: true }, function (error, doc) {
                        if (error) { console.log(error) }
                      })
                    }
                  }
                } catch (ex) {
                  reject(ex)
                  return
                }
                setTimeout(resolve, 1000)
              })
            }))
            promises.push(new Promise(function (resolve, reject) {
              userinfo.rank_friend(song.id, 2, 0, 10, function (err, response, body) {
                if (err) {
                  reject(err)
                  return
                }
                if (!body.success) {
                  reject(body.error_code)
                  return
                }
                try {
                  if (body.value.length > 0) {
                    const dRating = song.difficulties[2].detailed_rating
                    if (!isNaN(dRating)) {
                      body.value[0].rating = Math.max(dRating + calculateModifier(body.value[0].score), 0)
                    }
                    bestScore.push(body.value[0])
                    // console.log(song.id + ': ' + body)
                    if (isNaN(song.difficulties[2].noteNumber)) {
                      Song.findOneAndUpdate({ id: song.id }, { 'difficulties.2.noteNumber': (body.value[0].perfect_count + body.value[0].near_count + body.value[0].miss_count) }, { new: true, upsert: true }, function (error, doc) {
                        if (error) { console.log(error) }
                      })
                    }
                  }
                } catch (ex) {
                  reject(ex)
                  return
                }
                setTimeout(resolve, 1000)
              })
            }))
          })
          async function runWithSync () {
            for (const promise of promises) {
              await promise.then(() => {}).catch((ex) => { reject(ex) })
            }
          }
          runWithSync().then(() => {
            // console.log(bestScore)
            friend.best_score = bestScore
            friend.recent_update = Date.now()
            // console.log("Result collected.");
            resolve(friend)
          })
        })
      }

      return friends.then(function () {
        return addfriend()
      }).then(function (friend) {
        return includesBest ? getsonglist(friend) : friend
      }).then(function (data) {
        return includesBest ? getresults(data) : data
      }).then(function (friend) {
        return {
          success: true,
          value: friend
        }
      }).catch((error) => {
        console.log('ERROR! DATA:' + error)
        return {
          success: false,
          error_code: error
        }
      })
    })
  }
}
