<template>
  <b-container class="m-0">
    <h2>{{ $t('missions.record') }}</h2>
    <simple-profile :user="user" class="m-1" />
    <b-row v-if="missionName !== ''">
      <b-col md="6">
        <b-container :style="{ 'background-color': backgroundColor }" class="my-2 m-1">
          <h3>
            {{ missionName }}
            <b-badge :variant="playing ? 'info' : cleared ? 'success': 'danger'">
              {{ playing ? $t('missions.playing') : cleared ? $t('missions.cleared') : $t('missions.failed') }}
            </b-badge>
          </h3>
          <h5>{{ $t('missions.stage_upper', { num: stage_outside + 1 }) }}</h5>
          <div class="py-2">
            <h5>{{ totalResult.score.toLocaleString() }}</h5>
            <b-badge variant="primary">
              PURE
            </b-badge>
            {{ totalResult.perfect_count }} ({{ totalResult.shiny_perfect_count }})
            <br>
            <b-badge variant="warning">
              FAR
            </b-badge>
            {{ totalResult.near_count }}
            <br>
            <b-badge variant="danger">
              LOST
            </b-badge>
            {{ totalResult.miss_count }}
            <div v-if="missionType === 'health'">
              <b-badge variant="danger">
                {{ $t('missions.mission_health') }}
              </b-badge>
              {{ stage === 0 ? missionHealth : missionRecords[stage - 1].mission_health }}
              <span v-if="stage > 0" :class="healthDiff < 0 ? 'text-danger' : 'text-success'">({{ healthDiff }})</span>
              <br>
            </div>
          </div>
          <div v-if="missionType === 'health'" class="py-2">
            <div v-if="getStage(stage).health_mod !== undefined" class="py-2">
              <h5>{{ $t('missions.health.stage_changes') }}</h5>
              <health-mod :healthmod="getStage(stage).health_mod" />
            </div>
            <div v-else-if="mission.health_mod !== undefined" class="py-2">
              <h5>{{ $t('missions.health.changes') }}</h5>
              <health-mod :healthmod="mission.health_mod" />
            </div>
          </div>
          <div v-else class="py-2">
            <h5>{{ $t('missions.clear_conditions') }}</h5>
            <conditions :conditions="getConditions().global_conditions" />
            <div v-if="getStage(stage).conditions !== undefined">
              <h5>{{ $t('missions.stage_clear_conditions') }}</h5>
              <conditions :conditions="getStage(stage).conditions.global_conditions" />
            </div>
          </div>
          <div class="py-2">
            <b-badge variant="success">
              {{ $t('missions.time_stage_started') }}
            </b-badge>
            {{ $moment(timeStageStarted).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </b-container>
      </b-col>
      <b-col md="6">
        <b-container :style="{ 'background-color': mission.background_color }" class="my-2 m-1">
          <h3>{{ $t('missions.records') }}</h3>
          <div v-if="record.records.length > 0">
            <div v-for="(stageRecord, index) of record.records" :key="index">
              <stage-result :data="stageRecord" :songdata="songs[stageRecord.song_id]" :mission="mission" :stage="index+1" />
            </div>
          </div>
          <div v-else style="text-align: center;">
            {{ $t('missions.no_records') }}
          </div>
        </b-container>
      </b-col>
    </b-row>
    <b-container v-else style="text-align: center;" :style="{ 'background-color': backgroundColor }">
      {{ $t('missions.no_records') }}
    </b-container>
  </b-container>
</template>

<script>
import SimpleProfile from '~/components/SimpleProfile.vue'
import StageResult from '~/components/missions/StageResult.vue'
import Conditions from '~/components/missions/Conditions.vue'
import HealthMod from '~/components/missions/HealthMod.vue'

export default {
  components: {
    SimpleProfile,
    StageResult,
    Conditions,
    HealthMod
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    mission: {
      type: Object,
      default: () => {}
    },
    songs: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    record () {
      if (this.user.arcinfo.missions.playing === undefined || (typeof this.user.arcinfo.missions.playing) !== 'object') {
        return {}
      }
      return this.user.arcinfo.missions.playing
    },
    playing () {
      const missionData = this.user.arcinfo.missions.playing
      if (
        Object.prototype.hasOwnProperty.call(missionData, 'id') &&
        (typeof missionData.id) === 'string' &&
        missionData.failed !== true &&
        missionData.cleared !== true &&
        (Date.now() - (new Date(missionData.time_stage_started).getTime())) < 3.5 * 60000
      ) {
        return true
      }
      return false
    },
    healthDiff () {
      let changes = 0
      if (this.stage === 1) {
        changes = this.record.records[0].mission_health - this.mission.mission_health
      } else if (this.stage > 1) {
        changes = this.record.records[this.stage - 1].mission_health - this.record.records[this.stage - 2].mission_health
      }
      return changes > 0 ? '+' + changes : changes
    },
    backgroundColor () {
      const bgc = this.mission.background_color
      if (bgc === undefined) {
        return '#D0D0CE'
      }
      return bgc
    },
    missionName () {
      if (this.mission.name_localized === undefined) {
        return ''
      }
      if (Object.prototype.hasOwnProperty.call(this.mission.name_localized, this.$i18n.locale)) {
        return this.mission.name_localized[this.$i18n.locale]
      }
      return this.mission.name_localized.en
    },
    cleared () {
      if (!Object.prototype.hasOwnProperty.call(this.record, 'cleared')) {
        return false
      }
      return this.record.cleared === true
    },
    stage () {
      if (!Array.isArray(this.record.records)) {
        return 0
      }
      return this.record.records.length
    },
    stage_outside () {
      if (!Object.prototype.hasOwnProperty.call(this.record, 'stage')) {
        return 0
      }
      return this.record.stage
    },
    missionType () {
      if (!Object.prototype.hasOwnProperty.call(this.mission, 'type')) {
        return 'condition'
      }
      return this.mission.type
    },
    missionHealth () {
      if (!Object.prototype.hasOwnProperty.call(this.mission, 'mission_health')) {
        return 0
      }
      if (isNaN(this.mission.mission_health)) {
        return 0
      }
      return this.mission.mission_health
    },
    missionRecords () {
      if (!Object.prototype.hasOwnProperty.call(this.record, 'records')) {
        return []
      }
      if (!Array.isArray(this.record.records)) {
        return []
      }
      return this.record.records
    },
    timeStageStarted () {
      if (!Object.prototype.hasOwnProperty.call(this.record, 'time_stage_started')) {
        return 0
      }
      return this.record.time_stage_started
    },
    totalResult () {
      const total = {
        score: 0,
        shiny_perfect_count: 0,
        perfect_count: 0,
        near_count: 0,
        miss_count: 0,
        mission_health: 0
      }
      if (!Array.isArray(this.record.records)) {
        return total
      }
      for (const record of this.record.records) {
        for (const index of ['score', 'shiny_perfect_count', 'perfect_count', 'near_count', 'miss_count']) {
          if (Object.prototype.hasOwnProperty.call(record, index) && !isNaN(record[index])) {
            if (index === 'mission_health') {
              total[index] = record[index]
            } else {
              total[index] += record[index]
            }
          }
        }
      }
      return total
    }

  },
  methods: {
    getStage (stage) {
      if (!Object.prototype.hasOwnProperty.call(this.mission, 'stages')) {
        return {}
      }
      if (!Array.isArray(this.mission.stages)) {
        return {}
      }
      if (this.mission.stages.length <= stage) {
        return {}
      }
      return this.mission.stages[stage]
    },
    getConditions () {
      if (!Array.isArray(this.mission.conditions)) {
        return {}
      }
      if (!(this.mission.conditions.length > 0)) {
        return {}
      }
      return this.mission.conditions[0]
    }
  }
}
</script>

<style scoped>

</style>
