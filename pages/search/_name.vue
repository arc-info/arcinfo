<template>
  <b-container style="text-align: left;">
    <div v-if="code === ''" />
    <div v-else-if="code === 200">
      <div class="geosans" style="font-size: 48px;">
        {{ $t('search.results', { name: $route.params.name }) }}
      </div>
      <div style="font-size: 12px; mb-2">
        {{ $t('search.notice') }}
        <br>
        {{ $t('search.showing', { from: results.length > 0 ? skip + 1 : 0, to: skip+results.length }) }}
      </div>
      <div v-for="(user, index) in results" :key="index" style="cursor: pointer" class="m-1 mt-0" @click="toUser(index)">
        <simple-profile :user="user" />
      </div>
      <div v-if="results.length === 0" class="p-5" style="text-align:center;">
        {{ $t('search.noresults') }}
      </div>
      <b-button v-if="results.length === 100" variant="primary" @click="findMore">
        {{ $t('search.search_more') }}
      </b-button>
    </div>
  </b-container>
</template>

<script>
import SimpleProfile from '~/components/SimpleProfile.vue'

export default {
  components: {
    SimpleProfile
  },
  async asyncData ({ $axios, params }) {
    const ret = {}
    const data = await $axios.$get('/api/user/search/' + params.name)
    if (data.success) {
      const results = data.value
      ret.code = 200
      ret.results = results
      ret.title = params.name + ' Search Results - ARCINFO'
    } else {
      ret.code = data.error_code
      ret.title = 'Error! - ARCINFO'
    }
    return ret
  },
  data () {
    return {
      skip: 0,
      code: '',
      title: this.$t('loading') + ' - ARCINFO'
    }
  },
  methods: {
    toUser (index) {
      this.$router.push(this.localePath('/user/' + this.results[index].user_code))
    },
    async findMore () {
      this.skip += 100
      const data = await this.$axios.get('/api/user/search/' + this.$router.params.name + '?skip=' + this.skip)
      if (data.success) {
        const results = data.value
        this.code = 200
        this.results = results
        this.title = this.$router.params.name + ' Search Results - ARCINFO'
      } else {
        this.code = data.error_code
        this.title = 'Error! - ARCINFO'
      }
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

<style scoped>

</style>
