const fs = require('fs')

const Song = require('../models/song')
const Pack = require('../models/pack')
// const WorldMap = require('../models/world_map')
// const Character = require('../models/character')

const packlist = JSON.parse(fs.readFileSync('assets/data/packlist.json'))
const songlist = JSON.parse(fs.readFileSync('assets/data/songlist.json'))
// const charlist = JSON.parse(fs.readFileSync('assets/data/charlist.json'));
// const maplist = JSON.parse(fs.readFileSync('assets/data/maplist.json'));

module.exports = {
  update_db () {
    console.log('Updating Databases...')
    Song.insertMany(songlist.songs, { ordered: false }, function (_, doc) {
      new Song(doc).save().catch((_) => {})
    })
    Pack.insertMany(packlist.packs, { orderd: false }, function (_, doc) {
      new Pack(doc).save().catch((_) => {})
    })
  }
}
