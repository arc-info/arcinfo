<template>
  <b-navbar toggleable="md" type="light" variant="arcpink">
    <b-navbar-brand :to="localePath('/')">
      <logo :subtitle="subtitle" style="height:40px;" />
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse" class="ml-auto" />
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav :class="navClass">
        <b-nav-item href="https://arc-info.github.io/world-calculator">
          {{ $t('nav.worlds') }}
        </b-nav-item>
        <b-nav-item :to="localePath('/songs')">
          {{ $t('nav.songs') }}
        </b-nav-item>
        <!-- Disabled Non-implemented features.
        <b-nav-item href="https://arc-info.github.io/world-calculator" disabled>Multiplayer</b-nav-item> -->
        <b-nav-item :to="localePath('/missions')">
          {{ $t('nav.missions') }}
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-form :style="searchBoxStyle" class="px-2">
          <search-box />
        </b-nav-form>
        <b-nav-item-dropdown class="geosans" :text="$t('lang')" right>
          <b-nav-item
            v-for="locale in availableLocales"
            :key="locale.code"
            :to="switchLocalePath(locale.code)"
            right
          >
            {{ locale.name }}
          </b-nav-item>
        </b-nav-item-dropdown>
        <b-nav-item href="https://github.com/arc-info/arcinfo-issues/issues">
          {{ $t('nav.report') }}
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import Logo from '~/components/Logo.vue'
import SearchBox from '~/components/SearchBox.vue'

export default {
  components: {
    Logo,
    SearchBox
  },
  props: {
    navClass: {
      type: String,
      default: ''
    },
    searchBoxStyle: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    subtitle: ''
  }),
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    }
  }
}
</script>

<style scoped>
.nav-link {
  font-family: 'GeosansLight', Arial, Helvetica, sans-serif;
}
</style>
