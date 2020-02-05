<template>
  <div>
    <div v-for="[index, condition] of Object.entries(safeConditions)" :key="index">
      <div v-if="isCondition(index)">
        <b-badge>
          {{ $t('missions.conditions.' + index) }}
        </b-badge>
        {{ translateCondition(condition) }}
      </div>
    </div>
    <div v-if="!conditionExists" class="p-3">
      {{ $t('missions.conditions.none') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    conditions: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    let conditionExists = false
    let safeConditions = {}
    if (this.conditions !== undefined) { safeConditions = this.conditions }
    // eslint-disable-next-line no-unused-vars
    for (const [index, condition] of Object.entries(safeConditions)) {
      if (this.isCondition(index, condition)) {
        conditionExists = true
      }
    }
    return {
      // eslint-disable-next-line object-shorthand
      conditionExists: conditionExists,
      // eslint-disable-next-line object-shorthand
      safeConditions: safeConditions
    }
  },
  methods: {
    translateCondition (index, condition) {
      const numberType = ['score', 'shiny_perfect_count', 'perfect_count', 'near_count', 'miss_count', 'health']
      const arrayType = ['clear_type']

      if (numberType.includes(index)) {
        if (!isNaN(condition.more_than) && !isNaN(condition.less_than)) {
          if (condition.less_than > condition.more_than) {
            return this.$t('missions.conditions.range', { start: condition.more_than, end: condition.less_than })
          }
          return this.$t('missions.conditions.more', { value: condition.more_than }) + ' ' +
          this.$t('missions.conditions.or') + ' ' +
          this.$t('missions.conditions.less', { value: condition.less_than })
        } else if (!isNaN(condition.more_than)) {
          return this.$t('missions.conditions.more', { value: condition.more_than })
        }
        return this.$t('missions.conditions.less', { value: condition.less_than })
      }

      if (arrayType.includes(index) && condition !== undefined && condition.length > 0) {
        let clearTypes = ''
        for (const type of condition) {
          if (clearTypes === '') {
            clearTypes = this.$t('user.clear_type')[type]
          } else {
            clearTypes = ', ' + this.$t('user.clear_type')[type]
          }
        }
        return clearTypes
      }
      return ''
    },
    isCondition (index, condition) {
      return ['score', 'shiny_perfect_count', 'perfect_count', 'near_count', 'miss_count', 'health', 'songs'].includes(index) ||
      (index === 'clear_type' && condition !== undefined && condition.length > 0)
    }
  }
}
</script>

<style>

</style>
