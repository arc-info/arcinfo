<template>
  <b-container style="text-align: left;">
    <div v-if="code === ''">
      <b-container>
        {{ $t('loading') }}
      </b-container>
    </div>
    <div v-else-if="code === 200">
      <h2>{{ $t('songs.title') }}</h2>
      <b-nav class="my-3" variant="arcpink" pills small fill>
        <b-nav-item disabled>
          {{ $t('songs.sortby') }}
        </b-nav-item>
        <b-nav-item :active="sort_type === 'default'" @click="sort_type = 'default'">
          {{ $t('songs.sort_options.default') }}
        </b-nav-item>
        <b-nav-item :active="sort_type === 'level_pst'" @click="sort_type = 'level_pst'">
          {{ $t('songs.sort_options.level_pst') }}
        </b-nav-item>
        <b-nav-item :active="sort_type === 'level_prs'" @click="sort_type = 'level_prs'">
          {{ $t('songs.sort_options.level_prs') }}
        </b-nav-item>
        <b-nav-item :active="sort_type === 'level_ftr'" @click="sort_type = 'level_ftr'">
          {{ $t('songs.sort_options.level_ftr') }}
        </b-nav-item>
        <b-nav-item :active="sort_type === 'bpm'" @click="sort_type = 'bpm'">
          {{ $t('songs.sort_options.bpm') }}
        </b-nav-item>
        <b-nav-item :active="sort_type === 'name'" @click="sort_type = 'name'">
          {{ $t('songs.sort_options.name') }}
        </b-nav-item>
        <b-nav-item :active="sort_type === 'artist'" @click="sort_type = 'artist'">
          {{ $t('songs.sort_options.artist') }}
        </b-nav-item>
      </b-nav>
      <div style="text-align: right; height: 24px;">
        <b-form-checkbox
          v-model="desc"
          class="my-auto"
          style="float: right;"
          size="sm"
          variant="arcpink"
          switch
        >
          {{ desc ? $t('descend') : $t('ascend') }}
        </b-form-checkbox>
      </div>
      <b-tabs v-model="categoryIndex" pill lazy fill>
        <template v-slot:tabs-start>
          <li class="nav-item align-self-center">
            {{ $t('songs.categories') }}
          </li>
        </template>
        <b-tab :title="$t('songs.category.packs')">
          <div v-for="(category_pack) in Object.entries(packs_songs)" :key="category_pack[0]" class="m-1 mt-0">
            <b-container :style="{ 'background-color': getBackColorByPack(category_pack[0]) }" :class="getTextColorByPack(category_pack[0])">
              <div v-b-toggle="'packs_' + category_pack[0]" style="text-align:left; cursor: pointer;" class="geosans">
                <h3>
                  {{ categoryIndex === 0
                    ? localizedPackName(category_pack[0])
                    : category_pack[0]
                  }}
                </h3>
                {{ categoryIndex === 0
                  ? localizedPackDescription(category_pack[0])
                  : ''
                }}
              </div>
              <b-collapse :id="'packs_' + category_pack[0]" accordion="packs">
                <div v-for="(song, index) in category_pack[1]" :key="index" class="m-1 mt-0">
                  <song :song="song" :pack="packs[song.set]" :packtitle="false" />
                </div>
              </b-collapse>
            </b-container>
          </div>
        </b-tab>
        <b-tab :title="$t('songs.category.level')">
          <div v-for="(category_level) in (desc ? Object.entries(level_songs).sort((a, b) => { return b[0] - a[0]; }) : Object.entries(level_songs))" :key="category_level[0]" class="m-1 mt-0">
            <b-container :style="{ 'background-color': getBackColorByLevel(category_level[0]) }" :class="getTextColorByLevel(category_level[0])" class="p-1">
              <div v-b-toggle="'level_' + category_level[0]" class="geosans" style="text-align: center; cursor: pointer;">
                <h3>{{ $t('songs.category.level') }} {{ category_level[0] === '11' ? '10' : category_level[0] === '10' ? '9+' : category_level[0] }}</h3>
              </div>
              <b-collapse :id="'level_' + category_level[0]" accordion="level" class="mb-2">
                <div v-for="(song, index) in category_level[1]" :key="index" class="m-1 mt-0">
                  <song :song="song" :pack="packs[song.set]" />
                </div>
              </b-collapse>
            </b-container>
          </div>
        </b-tab>
        <b-tab :title="$t('songs.category.none')">
          <div v-for="(song, index) in songs" :key="index" class="m-1 mt-0">
            <song :song="song" :pack="packs[song.set]" />
          </div>
        </b-tab>
      </b-tabs>
    </div>
    <div v-else>
      <b-container>
        <p>{{ $t('error') }}</p>
        <p>{{ $t('code') + ' ' + code }}</p>
      </b-container>
    </div>
  </b-container>
</template>

<script>
import Song from '~/components/Song.vue'
import colorUtils from '~/utils/colorUtils'

export default {
  components: {
    Song
  },
  async asyncData ({ $axios, params }) {
    const ret = {}
    const songReq = await $axios.$get('/api/song?raw=true')
    const packReq = await $axios.$get('/api/pack/')
    if (songReq.success && packReq.success) {
      ret.songs = songReq.value
      ret.songs.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      ret.packs = packReq.value
      ret.code = 200
      ret.title = 'Song List - ARCINFO'
    } else if (!songReq.success) {
      ret.code = songReq.error_code
      ret.title = 'Error! - ARCINFO'
    } else {
      ret.code = packReq.error_code
      ret.title = 'Error! - ARCINFO'
    }
    return ret
  },
  data () {
    return {
      songs: [],
      code: '',
      title: this.$t('loading') + ' - ARCINFO',
      categoryIndex: 0,
      sort_type: 'default',
      desc: true
    }
  },
  computed: {
    packs_songs () {
      const ret = {}
      for (const song of this.songs) {
        if (!Array.isArray(ret[song.set])) { ret[song.set] = [] }
        ret[song.set].push(song)
      }
      return ret
    },
    level_songs () {
      const ret = {}
      for (const song of this.songs) {
        for (let i = 0; i < 3; i++) {
          if (!Array.isArray(ret[song.difficulties[i].rating])) { ret[song.difficulties[i].rating] = [] }
          ret[song.difficulties[i].rating].push(song)
        }
      }
      return ret
    }
  },
  watch: {
    sort_type () {
      this.reArrangeData()
    },
    desc () {
      this.reArrangeData()
    }
  },
  methods: {
    reArrangeData () {
      switch (this.sort_type) {
        case 'level_pst':
          this.songs.sort((a, b) => {
            const bRating = isNaN(b.difficulties[0].detailed_rating) ? b.difficulties[0].rating : b.difficulties[0].detailed_rating
            const aRating = isNaN(a.difficulties[0].detailed_rating) ? a.difficulties[0].rating : a.difficulties[0].detailed_rating
            return this.desc ? bRating - aRating : aRating - bRating
          })
          break
        case 'level_prs':
          this.songs.sort((a, b) => {
            const bRating = isNaN(b.difficulties[1].detailed_rating) ? b.difficulties[1].rating : b.difficulties[1].detailed_rating
            const aRating = isNaN(a.difficulties[1].detailed_rating) ? a.difficulties[1].rating : a.difficulties[1].detailed_rating
            return this.desc ? bRating - aRating : aRating - bRating
          })
          break
        case 'level_ftr':
          this.songs.sort((a, b) => {
            const bRating = isNaN(b.difficulties[2].detailed_rating) ? b.difficulties[2].rating : b.difficulties[2].detailed_rating
            const aRating = isNaN(a.difficulties[2].detailed_rating) ? a.difficulties[2].rating : a.difficulties[2].detailed_rating
            return this.desc ? bRating - aRating : aRating - bRating
          })
          break
        case 'bpm':
          this.songs.sort((a, b) => {
            return this.desc ? b.bpm_base - a.bpm_base : a.bpm_base - b.bpm_base
          })
          break
        case 'name':
          this.songs.sort((a, b) => {
            const bName = Object.prototype.hasOwnProperty.call(b.title_localized, this.$i18n.locale) ? b.title_localized[this.$i18n.locale] : b.title_localized.en
            const aName = Object.prototype.hasOwnProperty.call(a.title_localized, this.$i18n.locale) ? a.title_localized[this.$i18n.locale] : a.title_localized.en
            return this.desc ? bName.localeCompare(aName) : aName.localeCompare(bName)
          })
          break
        case 'artist':
          this.songs.sort((a, b) => {
            return this.desc ? b.artist.localeCompare(a.artist) : a.artist.localeCompare(b.artist)
          })
          break
        default:
          this.songs.sort((a, b) => {
            return this.desc ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime()
          })
      }
    },
    getBackColorByLevel (level) {
      return colorUtils.getBackColorByLevel(level)
    },
    getTextColorByLevel (level) {
      return colorUtils.isTextDarkByLevel(level) ? 'text-dark' : 'text-light'
    },
    getBackColorByPack (pack) {
      return colorUtils.getBackColorByPack(pack)
    },
    getTextColorByPack (pack) {
      return colorUtils.isTextDarkByPack(pack) ? 'text-dark' : 'text-light'
    },
    localizedPackName (pack) {
      return Object.prototype.hasOwnProperty.call(this.packs[pack].name_localized, this.$i18n.locale)
        ? this.packs[pack].name_localized[this.$i18n.locale]
        : this.packs[pack].name_localized.en
    },
    localizedPackDescription (pack) {
      if (pack === 'base') { return 'Free to Play' }
      return Object.prototype.hasOwnProperty.call(this.packs[pack].description_localized, this.$i18n.locale)
        ? this.packs[pack].description_localized[this.$i18n.locale]
        : this.packs[pack].description_localized.en
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

<style scoped>

</style>
