<template>
  <b-container :style="{ 'background-color': getBackColor()}" :class="getTextColor()" class="m-0 p-1">
    <b-row class="m-0">
      <b-col class="p-1" cols="auto">
        <rating-indicator :rating="user.rating / 100" size="4" />
      </b-col>
      <b-col class="my-auto" style="text-align: left;">
        <span class="geosans" style="font-size: 1.5rem;">{{ user.name }}</span>
        <br><span class="geosans">{{ new Intl.NumberFormat('en-US', {minimumIntegerDigits: 9, useGrouping: false}).format(user.user_code).toString().substring(0, 3) }} {{ new Intl.NumberFormat('en-US', {minimumIntegerDigits: 9, useGrouping: false}).format(user.user_code).toString().substring(3, 6) }} {{ new Intl.NumberFormat('en-US', {minimumIntegerDigits: 9, useGrouping: false}).format(user.user_code).toString().substring(6) }}</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RatingIndicator from '~/components/RatingIndicator.vue'
import colorUtils from '~/utils/colorUtils'

export default {
  components: {
    RatingIndicator
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    let favorites = []
    if (process.browser && localStorage.getItem('favorites') !== undefined && localStorage.getItem('favorites') !== null) {
      favorites = JSON.parse(localStorage.getItem('favorites'))
    }
    return {
      favorites
    }
  },
  computed: {
    is_favorites () {
      return Object.prototype.hasOwnProperty.call(this.favorites, this.user.user_code)
    }
  },
  methods: {
    toggleFavorites () {
      if (this.favorites.includes(this.user.user_code)) {
        this.favorites.spllice(this.favorites.indexOf(this.user.user_code), 1)
      } else {
        this.favorites.push(this.user.user_code)
      }
      if (process.browser) {
        localStorage.setItem('favorites', JSON.stringify(this.favorites))
      }
    },
    getBackColor () {
      return colorUtils.getBackColorByChar(this.user.character)
    },
    getTextColor () {
      return colorUtils.isTextDarkByChar(this.user.character) ? 'text-dark' : 'text-light'
    }
  }
}
</script>

<style scoped>
</style>
