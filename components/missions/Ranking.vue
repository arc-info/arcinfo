<template>
  <b-container class="m-0 p-1" :style="{ 'background-color': isme ? '#F48FB1' : '#fff' }">
    <b-row class="m-0">
      <b-col class="my-auto p-1 geosans" style="text-align: right; font-size: 2rem;" sm="1">
        #{{ rank + 1 }}
      </b-col>
      <b-col class="my-auto" style="text-align: left;">
        <b-row>
          <b-col sm="auto">
            <span class="geosans" style="font-size: 1.25rem;">
              {{ username }}
            </span>
            <b-badge variant="info">
              {{ clearTypeLocalized(safeRecord.mission_clear_type) }}
            </b-badge>
            <br>
            <span style="font-size: 1.5rem">
              {{ safeRecord.total.score.toLocaleString() }}
            </span>
          </b-col>
          <b-col class="my-auto">
            <b-row>
              <b-col v-if="mission !== undefined && mission.type === 'health'" cols="auto">
                <b-badge variant="secondary" class="ml-2">
                  {{ $t('missions.mission_health') }}
                </b-badge>
                {{ safeRecord.total.mission_health }}
              </b-col>
              <b-col cols="auto">
                <b-badge variant="primary" class="ml-2">
                  PURE
                </b-badge>
                {{ safeRecord.total.perfect_count }}({{ safeRecord.total.shiny_perfect_count }})
              </b-col>
              <b-col cols="auto">
                <b-badge variant="warning" class="ml-2">
                  FAR
                </b-badge>
                {{ safeRecord.total.near_count }}
              </b-col>
              <b-col cols="auto">
                <b-badge variant="danger" class="ml-2">
                  LOST
                </b-badge>
                {{ safeRecord.total.miss_count }}
              </b-col>
              <b-col cols="auto">
                <b-badge variant="success" class="ml-2">
                  {{ $t('user.time_recorded') }}
                </b-badge>
                {{ $moment(safeRecord.time_cleared).format('YYYY-MM-DD HH:mm') }}
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

export default {
  props: {
    username: {
      type: String,
      default: ''
    },
    record: {
      type: Object,
      default: () => {}
    },
    rank: {
      type: Number,
      default: 0
    },
    mission: {
      type: Object,
      default: () => {}
    },
    isme: {
      type: Boolean,
      default: () => {}
    }
  },
  computed: {
    safeRecord () {
      if (this.record === undefined) {
        return {}
      }
      return this.record
    }
  },
  methods: {
    clearTypeLocalized (type) {
      if (this.mission === undefined) { return '' }
      const comment = this.mission.clear_comment_localized[type]
      if (Object.prototype.hasOwnProperty.call(comment, this.$i18n.locale)) {
        return comment[this.$i18n.locale]
      }
      return comment.en
    }
  }
}
</script>

<style scoped>
</style>
