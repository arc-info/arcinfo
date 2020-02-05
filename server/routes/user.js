/* eslint-disable object-shorthand */
const express = require('express')
const userinfo = require('../workers/query')
const router = express.Router()
const queryWorker = require('../workers/query_worker')
const UserInfo = require('../models/user_info')
const Mission = require('../models/mission')
const missionHelper = require('../helpers/missionHelper')

router.get('/id/:user_code', function (req, res, next) {
  const option = req.query
  if (isNaN(req.params.user_code.length) || req.params.user_code.length !== 9) {
    res.send({
      success: false,
      error_code: 500
    })
    return
  }
  // Query from local database
  UserInfo.findOne({ user_code: req.params.user_code }, function (err, data) {
    // If force_update is on or no data found without no_update
    if (!(Object.prototype.hasOwnProperty.call(option, 'no_update') && option.no_update) && (err || data == null ||
      // Temporary Disabled Time Delay.
      (Object.prototype.hasOwnProperty.call(option, 'force_update') && option.force_update && ((Date.now() - data.recent_update.getTime()) > 3 * 1000 * 60)))) {
      console.log('Requested ' + req.params.user_code + ' from lowo')
      // Query lowo database
      queryWorker.get_user_info(req.params.user_code, true)
        .then((newdata) => {
        // Data is obtained
        // console.log("Data is obtained.");
          res.send(newdata)
          if (newdata.success) {
          // Save data to local database.
            UserInfo.findOneAndUpdate({ user_code: req.params.user_code }, newdata.value, { new: true, upsert: true }, function (error, doc) {
              if (error) { console.log(error) }
            })
            // Add rating record.
            UserInfo.findOneAndUpdate({ user_code: req.params.user_code },
              { $push: { rating_records: { timestamp: Date.now(), rating: newdata.value.rating } } },
              { new: true, upsert: true }, function (error, doc) {
                if (error) { console.log(error) }
              })
          }
        })
        .catch((error) => {
        // Data isn't obtained
          console.log("Data isn't obtained.")
          res.send({
            success: false,
            error_code: error
          })
        })
    } else if (Object.prototype.hasOwnProperty.call(option, 'force_update') && option.force_update && ((Date.now() - data.recent_update.getTime()) <= 3 * 1000 * 60)) {
      res.send({
        success: false,
        error_code: 601
      })
    } else if (data != null) {
      // If data is found
      res.send({
        success: true,
        value: data
      })
    } else {
      res.send({
        success: false,
        error_code: 404
      })
    }
  })
})

router.post('/usernames/', function (req, res, next) {
  if (!Array.isArray(req.body.codes)) {
    res.send({
      success: false,
      error_code: 500
    })
  }
  UserInfo.find({ user_code: { $in: req.body.codes } }, { name: 1, _id: 0, user_code: 1 })
    .then((users) => {
      if (users === null) {
        res.send({
          success: false,
          error_code: 404
        })
        return
      }
      const map = {}
      users.forEach((user) => {
        map[user.user_code] = user.name
      })
      res.send({
        success: true,
        value: map
      })
    }).catch((err) => {
      if (err) {
        res.send({
          success: false,
          error_code: err
        })
      }
    })
})

router.get('/recent/:user_code', function (req, res, next) {
  console.log('Requested recent data of ' + req.params.user_code)
  if (isNaN(req.params.user_code.length) || req.params.user_code.length !== 9) {
    res.send({
      success: false,
      error_code: 500
    })
  }
  queryWorker.get_user_info(req.params.user_code, false).then((newdata) => {
    res.send(newdata)
  })
})

router.get('/search/:name', function (req, res, next) {
  const option = req.query
  if (req.params.name.length < 3 || req.params.name.length > 15 || !(/^[a-z0-9]+$/i.test(req.params.name))) {
    res.send({
      success: false,
      error_code: 605
    })
  } else {
    let limit = 100
    if (!isNaN(option.limit)) { limit = option.limit }
    let skip = 0
    if (!isNaN(option.skip)) { skip = option.skip }

    UserInfo.find({ name: new RegExp(req.params.name, 'i'), rating: { $gt: 0 } }).limit(limit).skip(skip)
      .then((docs) => {
        res.send({
          success: true,
          value: docs
        })
      }).catch((reason) => {
        res.send({
          success: false,
          error_code: reason
        })
      })
  }
})

router.get('/mission/play/:code', function (req, res, next) {
  const option = req.query
  if (isNaN(req.params.code.length) || req.params.code.length !== 9 || option.mission === undefined) {
    res.send({
      success: false,
      error_code: 500
    })
  } else {
    const missionPromise = new Promise((resolve, reject) => {
      Mission.findOne({ id: option.mission })
        .then((mission) => {
          if (mission === null) {
            reject(404)
            return
          }
          resolve(mission)
        }).catch((err) => {
          if (err) {
            reject(err)
          }
        })
    })

    const userPromise = function (mission) {
      return new Promise((resolve, reject) => {
        UserInfo.findOne({ user_code: req.params.code })
          .then((user) => {
            if (user === null) {
              reject(404)
              return
            }
            if (missionHelper.isPlaying(user)) {
              reject(601)
              return
            }
            if (!missionHelper.isPlayable(user, mission)) {
              reject(602)
              return
            }
            const play = missionHelper.play(user, mission)
            if (play === false) {
              reject(500)
              return
            }
            resolve({
              success: true,
              value: {
                user: play
              }
            })
          }).catch((err) => {
            if (err) {
              reject(err)
            }
          })
      })
    }
    missionPromise.then((mission) => {
      return userPromise(mission)
    }).then((v) => {
      res.send(v)
    }).catch((reason) => {
      console.log('Error Catched: ' + reason)
      res.send({
        sucess: false,
        error_code: reason
      })
    })
  }
})

router.get('/mission/forcecheck/:code', function (req, res, next) {
  const option = req.query
  if (isNaN(req.params.code.length) || req.params.code.length !== 9) {
    res.send({
      success: false,
      error_code: 500
    })
  } else {
    const missionPromise = function (user) {
      return new Promise((resolve, reject) => {
        if (!missionHelper.isPlaying(user)) {
          reject(603)
          return
        }
        const missionData = user.arcinfo.missions.playing
        Mission.findOne({ id: missionData.id })
          .then((mission) => {
            if (mission === null) {
              reject(404)
              return
            }
            const newUser = missionHelper.checkResult(user, mission)
            newUser.then((result) => {
              if (result === false) {
                missionData.failed = true
                resolve({
                  success: true,
                  value: {
                    user: user
                  }
                })
              } else {
                resolve({
                  success: true,
                  value: {
                    user: result
                  }
                })
              }
            })
          }).catch((err) => {
            if (err) {
              reject(err)
            }
          })
      })
    }

    const userPromise = new Promise((resolve, reject) => {
      UserInfo.findOne({ user_code: req.params.code })
        .then((user) => {
          if (user === null) {
            reject(404)
            return
          }
          resolve(user)
        }).catch((err) => {
          if (err) {
            reject(err)
          }
        })
    })
    userPromise.then((user) => {
      return missionPromise(user)
    }).then((value) => {
      res.send(value)
    }).catch((reason) => {
      res.send({
        sucess: false,
        error_code: reason
      })
    })
  }
})

//* ***********************//
//  DEBUGGING PURPOSES    //
//* ***********************//

/* GET arcinfo user data. */
/*
router.get('/', function(req, res, next) {
  userinfo.user_info(function(err, response, body) {
    res.send(body);
    console.log(body);
  });
});

router.get('/del/:friend_id', function(req, res, next) {
  userinfo.friend_del(req.params.friend_id, function(err, response, body) {
    if(err) {
        res.status(500).send(err);
    } else {
      res.send(body);
    }
  });
});

router.get('/add/:friend_code', function(req, res, next) {
  userinfo.friend_add(req.params.friend_code, function(err, response, body) {
    if(err) {
        res.status(500).send(err);
    } else {
      res.send(body);
    }
  });
});

router.get('/rank/:song_id', function(req, res, next) {
  userinfo.rank_friend(req.params.song_id, 2, 0, 10, function(err, response, body) {
    if(err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
});
*/

module.exports = router
