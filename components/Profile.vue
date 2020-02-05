<template>
  <b-container :style="{ 'background-color': getBackColor() }" class="m-0" :class="getTextColor()">
    <b-row class="m-0">
      <b-col class="p-1" cols="auto">
        <rating-indicator :rating="user.rating / 100" size="9" />
      </b-col>
      <b-col class="user-info my-auto pl-3">
        <span class="geosans" style="font-size: 48px;">{{ user.name }}</span>
        <br><span class="geosans">{{ new Intl.NumberFormat('en-US', {minimumIntegerDigits: 9, useGrouping: false}).format(user.user_code).toString().substring(0, 3) }} {{ new Intl.NumberFormat('en-US', {minimumIntegerDigits: 9, useGrouping: false}).format(user.user_code).toString().substring(3, 6) }} {{ new Intl.NumberFormat('en-US', {minimumIntegerDigits: 9, useGrouping: false}).format(user.user_code).toString().substring(6) }}</span>
        <br><b-badge>{{ partner_name }}</b-badge> <b-badge>{{ $t('user.joined', { date: $moment(user.join_date).format('YYYY-MM-DD') }) }}</b-badge>
      </b-col>
      <b-col class="last-update ml-auto p-0" cols="auto">
        <b-row class="p-0 m-0 flex-nowrap">
          <b-col class="p-1" cols="auto">
            <span style="font-size: 12px;">{{ $t('user.last_update') }}</span><br><b-badge variant="arcpink50">
              {{ $moment(user.recent_update).format('YYYY-MM-DD HH:mm:ss') }}
            </b-badge>
          </b-col>
          <b-col class="p-1" cols="auto">
            <b-button v-if="update" :variant="translatedStatus()" :disabled="status === 'updating'" @click="onUpdate">
              <b-icon-arrow-repeat v-if="status === 'pending'" />
              <b-spinner v-else-if="status === 'updating'" type="grow" style="width: 1rem; height: 1rem;" />
              <b-icon-check v-else-if="status === 'success'" />
              <b-icon-alert-triangle-fill v-else />
            </b-button>
            <b-button :variant="is_favorites ? 'arcpink' : 'secondary'" @click="toggleFavorites">
              <b-icon-star-fill v-if="is_favorites" />
              <b-icon-star v-else />
            </b-button>
          </b-col>
        </b-row>
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
    },
    update: {
      type: String,
      default: 'false'
    },
    status: {
      type: String,
      default: 'pending'
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
    partner_name () {
      const partners = this.$t('partners')
      let uncapped = ''
      if (this.user.is_char_uncapped) {
        uncapped = this.$t('uncapped') + ' '
      }
      return uncapped + partners[this.user.character]
    },
    is_favorites () {
      return this.favorites.includes(this.user.user_code + '')
    }
  },
  methods: {
    onUpdate () {
      this.$emit('onUpdate')
    },
    translatedStatus () {
      let colorVarient = 'secondary'
      if (this.status === 'updating') {
        colorVarient = 'primary'
      } else if (this.status === 'success') {
        colorVarient = 'success'
      } else if (this.status === 'error') {
        colorVarient = 'danger'
      }
      return colorVarient
    },
    toggleFavorites () {
      if (this.favorites.includes(this.user.user_code + '')) {
        this.favorites.splice(this.favorites.indexOf(this.user.user_code), 1)
      } else {
        this.favorites.push(this.user.user_code + '')
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
.container {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.last-update {
  line-height: 16px;
}

.user-info {
  line-height:normal;
}
</style>
