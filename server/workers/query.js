/* eslint-disable object-shorthand */
/* eslint-disable quote-props */
const request = require('request')
const appver = '2.5.0'
const apiver = '8'
const appverFull = '2.5.0.0'
const uuid = 'FB205423-A581-4281-ADAE-C31B6718BC8F'
const headers = {
  'Accept-Language': 'en-us',
  Accept: '*/*',
  'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  'Accept-Encoding': 'br, gzip, deflate',
  AppVersion: appver,
  'User-Agent': 'Arc-mobile/' + appverFull + ' CFNetwork/976 Darwin/18.2.0',
  Authorization: '--',
  DeviceId: uuid
}

const api = {
  user_info (callback) {
    const options = {
      uri: 'https://arcapi.lowiro.com/' + apiver + '/user/me',
      method: 'GET',
      headers,
      gzip: true,
      json: true
    }
    request(options, callback)
  },
  friend_add (code, callback) {
    const options = {
      uri: 'https://arcapi.lowiro.com/' + apiver + '/friend/me/add',
      method: 'POST',
      headers,
      form: {
        friend_code: code
      },
      gzip: true,
      json: true
    }
    request(options, callback)
  },
  friend_del (id, callback) {
    const options = {
      uri: 'https://arcapi.lowiro.com/' + apiver + '/friend/me/delete',
      method: 'POST',
      headers,
      form: {
        friend_id: id
      },
      gzip: true,
      json: true
    }
    request(options, callback)
  },
  rank_friend (songId, difficulty, start, limit, callback) {
    const options = {
      uri: 'https://arcapi.lowiro.com/' + apiver + '/score/song/friend',
      method: 'GET',
      headers,
      qs: {
        'song_id': songId,
        'difficulty': difficulty,
        'start': start,
        'limit': limit
      },
      gzip: true,
      json: true
    }
    request(options, callback)
  }
}

module.exports = api
