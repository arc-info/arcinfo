<template>
  <div>
    <img src="~assets/logo.png"><span class="title d-none d-sm-inline">arcinfo</span><span class="subtitle d-none d-sm-inline">{{ subtitle }}</span>
  </div>
</template>

<script>
export default {
  props: {
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
div {
  font-size: 1rem;
  white-space: nowrap;
}

img {
  max-height: 100%;
  margin-top: -0.5em;
  margin-right: 0.1em;
}

.title {
  font-size: 1.75em;
  font-family: 'GeosansLight';
  margin-right: 0.1em;
}

.subtitle {
  font-size: 1em;
  font-family: 'GeosansLight';
}

</style>
