<template>
  <b-container :style="{ 'background-color': getBackColor()}" :class="getTextColor()" class="m-0 p-1">
    <b-row class="m-0">
      <b-col class="my-auto geosans" cols="6">
        <b-badge v-if="packtitle" :style="{ 'background-color': getBackColorByPack(pack.id) }" :class="getTextColorByPack(pack.id)" class="no-geosans">
          {{ Object.prototype.hasOwnProperty.call(pack.name_localized, $i18n.locale) ? pack.name_localized[$i18n.locale] : pack.name_localized.en }}
        </b-badge>
        <h3>{{ Object.prototype.hasOwnProperty.call(song.title_localized, $i18n.locale) ? song.title_localized[$i18n.locale] : song.title_localized.en }}</h3>
        <h5>{{ song.artist }}</h5>
      </b-col>
      <b-col v-if="pst" class="my-auto" style="text-align: center;">
        <b-badge variant="info">
          PAST
        </b-badge>
        <br>
        <span style="font-size: 2rem;">
          {{ song.difficulties[0].rating === 11 ? '10' : song.difficulties[0].rating === 10 ? '9+' : song.difficulties[0].rating }}
        </span>
        <br>
        {{ song.difficulties[0].detailed_rating }}
      </b-col>
      <b-col v-if="prs" class="my-auto" style="text-align: center;">
        <b-badge variant="success">
          PRESENT
        </b-badge>
        <br>
        <span style="font-size: 2rem;">
          {{ song.difficulties[1].rating === 11 ? '10' : song.difficulties[1].rating === 10 ? '9+' : song.difficulties[1].rating }}
        </span>
        <br>
        {{ song.difficulties[1].detailed_rating }}
      </b-col>
      <b-col v-if="ftr" class="my-auto" style="text-align: center;">
        <b-badge variant="danger">
          FUTURE
        </b-badge>
        <br>
        <span style="font-size: 2rem;">
          {{ song.difficulties[2].rating === 11 ? '10' : song.difficulties[2].rating === 10 ? '9+' : song.difficulties[2].rating }}
        </span>
        <br>
        {{ song.difficulties[2].detailed_rating }}
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import colorUtils from '~/utils/colorUtils'

export default {
  props: {
    song: {
      type: Object,
      default: () => {}
    },
    pack: {
      type: Object,
      default: () => {}
    },
    pst: {
      type: Boolean,
      default: true
    },
    prs: {
      type: Boolean,
      default: true
    },
    ftr: {
      type: Boolean,
      default: true
    },
    packtitle: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getBackColor () {
      return colorUtils.getBackColorBySide(this.song.side)
      // return this.song.bg !== '' ? colorUtils.getBackColorByBg(this.song.bg) : colorUtils.getBackColorBySide(this.song.side)
    },
    getTextColor () {
      return colorUtils.isTextDarkBySide(this.song.side) ? 'text-dark' : 'text-light'
      // return this.song.bg !== '' ? colorUtils.isTextDarkByBg(this.song.bg) : colorUtils.isTextDarkBySide(this.song.side)
    },
    getBackColorByPack (pack) {
      return colorUtils.getBackColorByPack(pack)
    },
    getTextColorByPack (pack) {
      return colorUtils.isTextDarkByPack(pack) ? 'text-dark' : 'text-light'
    }
  }
}
</script>

<style scoped>
.no-geosans {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
</style>
