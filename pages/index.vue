<template>
  <b-container class="transparent">
    <logo style="height:150px; font-size: 3rem;" />
    <search-box style="max-width: 800px; margin: 20px auto;" />
    <favorites v-if="favorites.length > 0" :favorites="favorites" style="max-width: 300px; margin: 10px auto;" />
  </b-container>
</template>

<script>
import Logo from '~/components/Logo.vue'
import SearchBox from '~/components/SearchBox.vue'
import Favorites from '~/components/Favorites.vue'

export default {
  components: {
    Logo,
    SearchBox,
    Favorites
  },
  data () {
    let favorites = []
    if (process.browser && localStorage.getItem('favorites') !== undefined && localStorage.getItem('favorites') !== null) {
      favorites = JSON.parse(localStorage.getItem('favorites'))
    }
    return {
      favorites
    }
  },
  head () {
    return {
      title: 'ARCINFO'
    }
  },
  layout: 'index'
}
</script>

<style scoped>

.transparent {
  background-color: transparent;
  text-align: center;
}
</style>
