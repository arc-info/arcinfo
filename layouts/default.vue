<template>
  <div>
    <nav-bar />
    <nuxt />
  </div>
</template>
<script>
import NavBar from '~/components/NavBar.vue'

export default {
  components: {
    NavBar
  }
}
</script>

<style>
@font-face {
    font-family: 'GeosansLight';
    font-style: normal;
    font-weight: normal;
    src: local('GeosansLight'), url('~assets/GeosansLight.woff') format('woff');
}

@font-face {
    font-family: 'GeosansLight-Oblique';
    font-style: normal;
    font-weight: normal;
    src: local('GeosansLight-Oblique'), url('~assets/GeosansLight-Oblique.woff') format('woff');
}

html {
  height: 100%;
}

body {
    background-image: url("~assets/background_darkened.jpg");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
    height: 100%;
}

.geosans {
    font-family: 'GeosansLight', Arial, Helvetica, sans-serif;
}

.container {
    background-color: white;
    height: 100%;
    margin: 1.5rem;
    padding: 1.5rem;
    border-radius: 10px;
    margin-right: auto;
    margin-left: auto;
}
</style>
