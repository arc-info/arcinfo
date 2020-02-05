<template>
  <b-container class="p-0 m-1">
    <b-row class="m-0 mt-1" @click="details = !details">
      <b-col class="p-0 geosans" :sm="isbest === 'true' ? 2 : 'auto'" md="auto" :lg="isbest === 'true' ? 1 : 'auto'" :style="{ color: data.rank <= 30 ? '--danger' : istarget ? '--success' : 'inherit'}">
        <b-row style="height: 100%;">
          <b-col v-if="isbest === 'true'" cols="9">
            <span style="font-size: 2rem;" class="pr-1">#{{ data.rank }}</span><br class="d-none d-sm-inline">
            <b-badge
              v-if="data.rank <= 30"
              v-b-popover.hover.top="$t('user.popover.best30.desc')"
              :title="$t('user.popover.best30.title')"
              variant="danger"
            >
              {{ $t('user.best_30') }}
              <b-icon-question-fill />
            </b-badge>
            <b-badge
              v-if="istarget"
              v-b-popover.hover.top="$t('user.popover.target.desc')"
              :title="$t('user.popover.target.title')"
              variant="success"
            >
              {{ $t('user.target') }}
              <b-icon-question-fill />
            </b-badge>
          </b-col>
          <b-col class="d-none d-sm-block p-0 m-0" cols="auto">
            <div class="bg-arcpink50" :style="{ height: (100 - data.health) + '%'}" />
            <div
              :class="{
                'bg-purple': data.clear_type === 0,
                'bg-primary': data.clear_type === 1,
                'bg-info': data.clear_type === 2 || data.clear_type === 3,
                'bg-success': data.clear_type === 4,
                'bg-danger': data.clear_type === 5
              }"
              style="color: white; font-size: 6pt; width: 12px; text-align: center;"
              :style="{ height: data.health + '%' }"
            >
              {{ data.health }}
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col>
        <b-row>
          <b-col cols="6">
            <div style="font-size: 1.5rem;">
              {{ Object.prototype.hasOwnProperty.call(songdata.title_localized, $i18n.locale) ? songdata.title_localized[$i18n.locale] : songdata.title_localized.en }}
            </div>
            <span :class="data.difficulty === 0 ? 'text-primary' : data.difficulty === 1 ? 'text-success' : 'text-danger'">
              {{ data.difficulty === 0 ? 'PST' : data.difficulty === 1 ? 'PRS' : 'FTR' }}
              {{ songdata.difficulties[data.difficulty].rating === 11 ? 10 : (songdata.difficulties[data.difficulty].rating === 10 ? '9+' : songdata.difficulties[data.difficulty].rating) }}({{ songdata.difficulties[data.difficulty].detailed_rating }})
            </span>
            <br>
            {{ songdata.artist }}
            <h3>{{ data.score.toLocaleString() }}</h3>
          </b-col>
          <b-col class="my-auto" cols="auto">
            <b-badge variant="arcpink">
              {{ $t('user.rating') }}
            </b-badge>
            {{ data.rating > 0 ? new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Math.round(data.rating * 100) / 100) : $t('user.immeasurable') }}
            <b-icon-question-fill
              v-if="data.rating < 0"
              v-b-popover.hover.top="$t('user.popover.immeasurable.desc')"
              :title="$t('user.popover.immeasurable.title')"
            />
            <br>
            <b-badge variant="primary">
              PURE
            </b-badge> {{ data.perfect_count }} ({{ data.shiny_perfect_count }})<br>
            <b-badge variant="warning">
              FAR
            </b-badge> {{ data.near_count }}<br>
            <b-badge variant="danger">
              LOST
            </b-badge> {{ data.miss_count }}<br>
          </b-col>
        </b-row>
        <b-badge
          :class="{
            'bg-danger': data.clear_type === 0,
            'bg-primary': data.clear_type === 1,
            'bg-purple': data.clear_type === 2,
            'bg-info': data.clear_type === 3,
            'bg-success': data.clear_type === 4,
            'bg-arcpink': data.clear_type === 5
          }"
        >
          {{ getClearType(data.clear_type) }}
        </b-badge>
        <b-badge v-if="data.clear_type !== data.best_clear_type" variant="secondary">
          BEST: {{ getClearType(data.best_clear_type) }}
        </b-badge><br>
        <b-badge variant="success">
          {{ $t('user.time_recorded') }}
        </b-badge> {{ $moment(data.time_played).format('YYYY-MM-DD HH:mm:ss') }}
      </b-col>
    </b-row>
    <b-collapse id="details" v-model="details" class="mt-1">
      <h5>
        {{ $t('user.rating_sim') }}
        <b-icon-question-fill
          v-b-popover.hover.top="$t('user.popover.rating_sim.desc')"
          :title="$t('user.popover.rating_sim.title')"
        />
      </h5>
      <b-progress min="0" :max="10000000 - getMinScore()">
        <b-progress-bar :value="best30Score() - getMinScore()" variant="primary">
          {{ new Intl.NumberFormat('en-US').format(Math.round(best30Score())) }}
        </b-progress-bar>
        <b-progress-bar :value="10000000 - best30Score()" variant="danger" />
      </b-progress>
      <b-form-input v-model="sim_score" type="range" :min="parseInt(getMinScore(), 10)" max="10000000" />
      <b-badge variant="success">
        {{ $t('user.score') }}
      </b-badge> {{ new Intl.NumberFormat('en-US').format(Math.round(sim_score)) }} <b-badge variant="arcpink">
        {{ $t('user.rating') }}
      </b-badge> <span :class="{'text-danger': (sim_score >= best30Score())}">{{ new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Math.round(getRating() * 100) / 100) }}</span>
      <span v-show="sim_score >= best30Score()">
        <b-badge variant="info">
          {{ $t('user.newbest30avg') }}
        </b-badge>
        {{ new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Math.round(newBest30Avg() * 100) / 100) }}
        <span class="text-success">
          (+{{ new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Math.round((newBest30Avg() - best30) * 100) / 100) }})
        </span>
      </span>
      <!-- Disabled Not-Implemented Feature.
        <b-button class="ml-auto d-block" variant="primary" disabled>{{ $t('user.song_info') }}</b-button> -->
    </b-collapse>
  </b-container>
</template>

<script>
import scoreUtils from '~/utils/scoreUtils'
// CLEAR TYPE
// 0: LOST, 1: Normal Clear, 2: Full Recall, 3: Pure Memory, 4: Easy Clear, 5: Hard Clear
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    songdata: {
      type: Object,
      default: () => {}
    },
    packdata: {
      type: Object,
      default: () => {}
    },
    isbest: {
      type: String,
      default: 'true'
    },
    istarget: Boolean,
    lowest30: {
      type: Number,
      default: 0
    },
    best30: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      details: false,
      sim_score: this.data.score
    }
  },
  methods: {
    getClearType (type) {
      return this.$t('user.clear_type')[type]
    },
    best30Score () {
      if (this.data.rating >= this.lowest30) { return this.data.score }
      const score = scoreUtils.get_score(this.songdata.difficulties[this.data.difficulty].detailed_rating, this.lowest30)
      return score < 0 ? 10000000 : score
    },
    getRating () {
      return scoreUtils.get_rating(this.songdata.difficulties[this.data.difficulty].detailed_rating, this.sim_score)
    },
    getMinScore () {
      let rating = this.data.rating
      if (this.rating > rating) { rating = this.rating }
      const score = scoreUtils.get_score(this.songdata.difficulties[this.data.difficulty].detailed_rating, rating - 1)
      return score < 0 ? 5000000 : score
    },
    newBest30Avg () {
      if (this.data.rating >= this.lowest30) {
        return this.best30 + ((this.getRating() - this.data.rating) / 30)
      } else {
        return this.best30 - (this.lowest30 / 30) + (this.getRating() / 30)
      }
    }
  }
}
</script>

<style scoped>

</style>
