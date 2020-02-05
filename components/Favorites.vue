<template>
  <client-only>
    <b-container style="text-align: left;" class="p-0">
      <div class="p-1 geosans" style="font-size: 24px;">
        <b-icon-star-fill /> {{ $t('favorites') }}
      </div>
      <div v-for="(user, index) in users" :key="index" style="cursor: pointer" class="p-1 pt-0" @click="toUser(index)">
        <simple-profile :user="user" :hasfavorites="true" />
      </div>
    </b-container>
  </client-only>
</template>

<script>
import SimpleProfile from '~/components/SimpleProfile.vue'

export default {
  components: {
    SimpleProfile
  },
  props: {
    favorites: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    const users = []
    this.favorites.forEach(async (code) => {
      const data = await this.$axios.get('/api/user/id/' + code + '?no_update=true')
      users.push(data.data.value)
    })
    return {
      users
    }
  },
  methods: {
    toUser (index) {
      this.$router.push(this.localePath('/user/' + this.users[index].user_code))
    }
  }
}
</script>

<style scoped>

</style>
