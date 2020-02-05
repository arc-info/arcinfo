<template>
  <b-container class="p-3 m-1">
    <div v-b-toggle="stage + ''" style="cursor: pointer;">
      <span style="font-size: 1.75rem;">{{ $t('missions.stage', { num: stage }) }}</span>
      <b-badge v-if="data.cleared" variant="success">
        {{ $t('missions.cleared') }}
      </b-badge>
      <b-badge v-else variant="danger">
        {{ $t('missions.failed') }}
      </b-badge>
    </div>
    <b-collapse :id="stage + ''">
      <b-row class="m-0 mt-1">
        <b-col class="p-0 geosans" sm="auto" md="auto">
          <div class="bg-arcpink50" :style="{ width: '12px', height: (100 - health) + '%'}" />
          <div
            :class="{
              'bg-purple': data.clear_type === 0,
              'bg-primary': data.clear_type === 1,
              'bg-info': data.clear_type === 2 || data.clear_type === 3,
              'bg-success': data.clear_type === 4,
              'bg-danger': data.clear_type === 5
            }"
            style="color: white; font-size: 6pt; width: 12px; text-align: center;"
            :style="{ height: health + '%' }"
          >
            {{ health === 0 ? '' : health }}
          </div>
        </b-col>
        <b-col>
          <b-row>
            <b-col cols="6">
              <div style="font-size: 1.5rem;">
                {{ Object.prototype.hasOwnProperty.call(songdata.title_localized, $i18n.locale) ? songdata.title_localized[$i18n.locale] : songdata.title_localized.en }}
              </div>
              <span :class="data.difficulty * 1 === 0 ? 'text-primary' : data.difficulty * 1 === 1 ? 'text-success' : 'text-danger'">
                {{ data.difficulty * 1 === 0 ? 'PST' : data.difficulty * 1 === 1 ? 'PRS' : 'FTR' }}
                {{ songdata.difficulties[data.difficulty].rating === 11 ? 10 : (songdata.difficulties[data.difficulty].rating === 10 ? '9+' : songdata.difficulties[data.difficulty].rating) }}({{ songdata.difficulties[data.difficulty].detailed_rating }})
              </span>
              <br>
              {{ songdata.artist }}
              <h3>{{ data.score.toLocaleString() }}</h3>
            </b-col>
            <b-col class="my-auto" cols="auto">
              <b-badge variant="primary">
                PURE
              </b-badge> {{ data.perfect_count }} ({{ data.shiny_perfect_count }})<br>
              <b-badge variant="warning">
                FAR
              </b-badge> {{ data.near_count }}<br>
              <b-badge variant="danger">
                LOST
              </b-badge> {{ data.miss_count }}<br>
              <span v-if="!isNaN(data.mission_health)">
                <b-badge variant="info">
                  {{ $t('missions.mission_health') }}
                </b-badge> {{ data.mission_health }}<br>
              </span>
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
          </b-badge><br>
          <b-badge variant="success">
            {{ $t('user.time_recorded') }}
          </b-badge> {{ $moment(data.time_played).format('YYYY-MM-DD HH:mm:ss') }}
        </b-col>
      </b-row>
    </b-collapse>
  </b-container>
</template>

<script>
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
    mission: {
      type: Object,
      default: () => {}
    },
    stage: {
      type: Number,
      default: 1
    }
  },
  computed: {
    health () {
      return this.data.health > 0 ? this.data.health : 0
    }
  },
  methods: {
    getClearType (type) {
      return this.$t('user.clear_type')[type]
    }
  }
}
</script>

<style scoped>

</style>
