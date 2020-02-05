<template>
  <div>
    <span v-for="[index, mod] of Object.entries(healthmod)" :key="index">
      <b-badge :variant="varient(index)">
        {{ string(index) }}
      </b-badge>
      {{ modT(mod) }}
      <br>
    </span>
    <span v-if="!healthModExist">
      {{ $t('missions.health.no_diff') }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    healthmod: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    let healthModExist = false
    const modList = ['shiny_perfect', 'perfect', 'near', 'miss', 'end']
    if (this.healthmod !== undefined) {
      // eslint-disable-next-line no-unused-vars
      for (const [index, mod] of Object.entries(this.healthmod)) {
        if (modList.includes(index)) {
          healthModExist = true
          break
        }
      }
    }
    return {
      healthModExist
    }
  },
  methods: {
    varient (index) {
      switch (index) {
        case 'shiny_perfect':
        case 'perfect':
          return 'primary'
        case 'near':
          return 'warning'
        case 'miss':
          return 'danger'
        default:
          return 'success'
      }
    },
    string (index) {
      switch (index) {
        case 'shiny_perfect':
          return this.$t('missions.pure_shiny')
        case 'perfect':
          return 'PURE'
        case 'near':
          return 'FAR'
        case 'miss':
          return 'LOST'
        default:
          return this.$t('missions.health.stage_cleared')
      }
    },
    modT (mod) {
      if (mod > 0) {
        return '+' + mod
      }
      return mod
    }
  }
}
</script>

<style>

</style>
