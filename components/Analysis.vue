<template>
  <b-container class="m-0">
    <div>
      <h5>{{ $t('analysis.filters.title') }}</h5>
      <b-form class="mb-3" inline @submit.prevent="fillData()">
        <b-form-group :label="$t('analysis.filters.difficulties')">
          <b-form-checkbox-group id="difficulties" v-model="difficulties" name="difficulties" size="sm">
            <b-form-checkbox value="PST">
              PST
            </b-form-checkbox>
            <b-form-checkbox value="PRS">
              PRS
            </b-form-checkbox>
            <b-form-checkbox value="FTR">
              FTR
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-form-group :label="$t('analysis.filters.ratingrange')">
          <b-input-group>
            <b-input-group-prepend is-text>
              <b-form-checkbox v-model="ratingrangeenabled" />
            </b-input-group-prepend>
            <b-form-input v-model="ratingrange[0]" type="number" :max="ratingrange[1]" :aria-label="$t('analysis.filters.ratingrange_start')" :disabled="!ratingrangeenabled" />
            <b-input-group-prepend is-text>
              ~
            </b-input-group-prepend>
            <b-form-input v-model="ratingrange[1]" type="number" :min="ratingrange[0]" :aria-label="$t('analysis.filters.ratingrange_end')" :disabled="!ratingrangeenabled" />
          </b-input-group>
        </b-form-group>
        <b-button class="mt-4 ml-2 mb-0" variant="arcpink" type="submit">
          {{ $t('submit') }}
        </b-button>
      </b-form>
    </div>
    <b-row class="p-0 m-0">
      <b-col md="6">
        <h2>{{ $t('analysis.rating_records.title') }}</h2>
        <client-only>
          <rating-records style="height: 300px;" :chart-data="ratingrecords" />
        </client-only>
      </b-col>
      <b-col md="6">
        <h2>{{ $t('analysis.rank_clear.title') }}</h2>
        <client-only>
          <rank-clear :chart-data="rankclear" />
        </client-only>
      </b-col>
    </b-row>
    <div>
      <h2>{{ $t('analysis.song_ratings.title') }}</h2>
      <client-only>
        <song-ratings style="height: 300px;" :chart-data="songratings" />
      </client-only>
    </div>
  </b-container>
</template>

<script>
import RatingRecords from '~/charts/analysis/RatingRecords'
import SongRatings from '~/charts/analysis/SongRatings'
import RankClear from '~/charts/analysis/RankClear'

export default {
  components: {
    RatingRecords,
    SongRatings,
    RankClear
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    songlist: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      difficulties: ['PST', 'PRS', 'FTR'],
      ratingrange: [0, Infinity],
      ratingrangeenabled: false,
      songratings: null,
      rankclear: null,
      ratingrecords: null
    }
  },
  mounted () {
    this.fillData()
  },
  methods: {
    convertDiff (diff) {
      return diff === 0 ? 'PST' : diff === 1 ? 'PRS' : 'FTR'
    },
    fillData () {
      const songratings = {
        labels: [],
        datasets: [
          {
            label: this.$t('analysis.song_ratings.score'),
            borderColor: '#F48FB1',
            pointBackgroundColor: '#2196f3',
            data: []
          }
        ]
      }
      this.user.best_score.forEach((record) => {
        const drating = this.songlist[record.song_id].difficulties[record.difficulty].detailed_rating
        if (!isNaN(drating)) {
          if (this.difficulties.includes(this.convertDiff(record.difficulty)) && (!this.ratingrangeenabled || (this.ratingrange[0] <= drating && this.ratingrange[1] >= drating))) {
            songratings.datasets[0].data.push({
              x: this.songlist[record.song_id].difficulties[record.difficulty].detailed_rating,
              y: record.score,
              name: Object.prototype.hasOwnProperty.call(this.songlist[record.song_id].title_localized, this.$i18n.locale) ? this.songlist[record.song_id].title_localized[this.$i18n.locale] : this.songlist[record.song_id].title_localized.en,
              difficulty: this.convertDiff(record.difficulty)
            })
          }
        }
      })
      const rankclear = {
        labels: [
          'EX',
          'AA',
          'A',
          'B',
          'C',
          'D',
          this.$t('user.clear_type')[3], // PURE MEMORY
          this.$t('user.clear_type')[2], // FULL RECALL
          this.$t('user.clear_type')[5], // HARD CLEAR
          this.$t('user.clear_type')[1], // NORMAL CLEAR
          this.$t('user.clear_type')[4], // EASY CLEAR
          this.$t('user.clear_type')[0] // TRACK LOST
        ],
        datasets: [
          {
            label: this.$t('analysis.rank_clear.rank'),
            backgroundColor: [
              '#1565c0',
              '#6a1b9a',
              '#4527a0',
              '#00695c',
              '#2e7d32',
              '#c62828',
              '#1565c0', // PURE MEMORY
              '#6a1b9a', // FULL RECALL
              '#4527a0', // HARD CLEAR
              '#00695c', // NORMAL CLEAR
              '#2e7d32', // EASY CLEAR
              '#c62828' // TRACK LOST
            ],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            label: [
              this.$t('analysis.rank_clear.clear_type')[5],
              this.$t('analysis.rank_clear.clear_type')[3],
              this.$t('analysis.rank_clear.clear_type')[1],
              this.$t('analysis.rank_clear.clear_type')[0],
              this.$t('analysis.rank_clear.clear_type')[4],
              this.$t('analysis.rank_clear.clear_type')[2]
            ],
            backgroundColor: [
              '#1565c0',
              '#6a1b9a',
              '#4527a0',
              '#00695c',
              '#2e7d32',
              '#c62828',
              '#1565c0', // PURE MEMORY
              '#6a1b9a', // FULL RECALL
              '#4527a0', // HARD CLEAR
              '#00695c', // NORMAL CLEAR
              '#2e7d32', // EASY CLEAR
              '#c62828' // TRACK LOST
            ],
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      }
      const clearTypeTrans = [5, 3, 1, 0, 4, 2]
      this.user.best_score.forEach((record, index) => {
        const drating = this.songlist[record.song_id].difficulties[record.difficulty].detailed_rating
        if (this.difficulties.includes(this.convertDiff(record.difficulty)) && (!this.ratingrangeenabled || (this.ratingrange[0] <= drating && this.ratingrange[1] >= drating))) {
          rankclear.datasets[1].data[clearTypeTrans[record.clear_type] + 6]++
          const score = record.score
          if (score >= 9800000) {
            rankclear.datasets[0].data[0]++
          } else if (score >= 9500000) {
            rankclear.datasets[0].data[1]++
          } else if (score >= 9200000) {
            rankclear.datasets[0].data[2]++
          } else if (score >= 8900000) {
            rankclear.datasets[0].data[3]++
          } else if (score >= 8600000) {
            rankclear.datasets[0].data[4]++
          } else {
            rankclear.datasets[0].data[5]++
          }
        }
      })
      const ratingrecords = {
        labels: [],
        datasets: [
          {
            label: this.$t('analysis.rating_records.ratings'),
            borderColor: '#F48FB1',
            pointBackgroundColor: '#F48FB1',
            data: []
          }
        ]
      }
      this.user.rating_records.forEach((record, index) => {
        if (!(record.rating < 0)) {
          if ((this.user.rating_records.length > index + 1 && this.$moment(this.user.rating_records[index + 1].timestamp).format('YYYY-MM-DD') !== this.$moment(record.timestamp).format('YYYY-MM-DD')) || (this.user.rating_records.length === index + 1)) {
            ratingrecords.labels.push(this.$moment(record.timestamp).format('YYYY-MM-DD'))
            ratingrecords.datasets[0].data.push({
              t: new Date(record.timestamp),
              y: record.rating / 100
            })
          }
        }
      })
      this.songratings = songratings
      this.rankclear = rankclear
      this.ratingrecords = ratingrecords
    }
  }
}
</script>

<style scoped>

</style>
