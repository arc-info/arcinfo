<template>
  <b-container style="text-align: center;">
    <h2 v-if="error.statusCode === 404">
      Page Not Found.
    </h2>
    <h2 v-else>
      An Error Occurred.
    </h2>
    <p v-if="error.statusCode !== 404">
      {{ error.statusCode }}
    </p>
    <b-button to="/">
      GO BACK 2 YOUR HOME
    </b-button>
  </b-container>
</template>
<script>

export default {
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  layout: 'default'
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
