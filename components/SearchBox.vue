<template>
  <div>
    <b-input-group size="md" label="Search" @keydown.enter.prevent @submit.prevent>
      <b-form-input
        id="search-input"
        v-model="target"
        :placeholder="$t('search.placeholder')"
        :aria-placeholder="$t('search.placeholder')"
        @keydown.enter.prevent
        @submit.prevent
        @keyup.enter="onSearch"
      />
      <b-button id="search-button" variant="secondary" @keydown.enter.prevent @submit.prevent @click="onSearch">
        {{ $t('search.search') }}
      </b-button>
    </b-input-group>
  </div>
</template>

<script>
export default {
  data () {
    return {
      target: ''
    }
  },
  methods: {
    onSearch () {
      if (this.target.replace(/ /g, '').length === 9 && !isNaN(this.target.replace(/ /g, ''))) {
        this.$router.push(this.localePath('/user/' + this.target.replace(/ /g, '')))
      } else if (this.target.length >= 3 && this.target.length <= 15 && /^[a-z0-9]+$/i.test(this.target)) {
        this.$router.push(this.localePath('/search/' + this.target))
      } else {
        this.$bvToast.toast(this.$t('search.invaild.desc'), {
          title: this.$t('search.invaild.title'),
          variant: 'danger',
          toaster: 'b-toaster-bottom-right'
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
