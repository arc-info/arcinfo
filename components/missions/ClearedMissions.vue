<template>
  <b-container class="p-3 m-1">
    <div v-for="[index, record] of Object.entries(clearRecords)" :key="index">
      <b-container class="p-2 m-1" :style="{ 'background-color': missions[index].background_color }">
        <h4>
          {{ Object.prototype.hasOwnProperty.call(missions[index].name_localized, $i18n.locale) ? missions[index].name_localized[$i18n.locale] : missions[index].name_localized.en }}
        </h4>
        {{ Object.prototype.hasOwnProperty.call(missions[index].clear_comment_localized[record.mission_clear_type], $i18n.locale) ? missions[index].clear_comment_localized[record.mission_clear_type][$i18n.locale] : missions[index].clear_comment_localized[record.mission_clear_type].en }}
      </b-container>
    </div>
    <div v-if="Object.entries(clearRecords).length === 0">
      <b-container>
        {{ $t('missions.no_records') }}
      </b-container>
    </div>
  </b-container>
</template>

<script>
// CLEAR TYPE
// 0: LOST, 1: Normal Clear, 2: Full Recall, 3: Pure Memory, 4: Easy Clear, 5: Hard Clear
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    missions: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    clearRecords () {
      if (this.user.arcinfo === undefined || this.user.arcinfo.missions === undefined || this.user.arcinfo.missions.cleared === undefined) {
        return {}
      }
      return this.user.arcinfo.missions.cleared
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
