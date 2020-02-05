<template>
  <div
    class="indicator"
    :style="{
      width: size + 'rem',
      height: size + 'rem'
    }"
    :class="ratingClass"
  >
    <div
      class="geosans"
      :style="{
        'text-align': 'center',
        'font-size': (size / 2.5) + 'rem',
        'color': 'white',
        'text-shadow': '0px 0px ' + (size / 12) + 'rem' + ' black, 0px 0px ' + (size / 24) + 'rem' + ' black',
        'margin-left': (rating < 0) ? (size / 80) + 'rem' : -1 * (size / 20) + 'rem',
        'padding-top': (rating < 0) ? (size / 5.4) + 'rem' : (size / 4.9) + 'rem'
      }"
    >
      {{ (greaterThan(0, rating)) ? '--' : new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Math.round(rating * 100) / 100) }}
    </div>
    <div
      v-if="star > 0"
      class="star"
      :style="{
        'text-align': 'center',
        'font-size': (size / 5) + 'rem',
        'color': 'white',
        'text-shadow': '0px 0px ' + (size / 12) + 'rem' + ' darkred, 0px 0px ' + (size / 24) + 'rem' + ' black',
        'margin-top': -1 * (size / 15) + 'rem',
      }"
    >
      ★<span v-if="star > 1">★</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: '9'
    }
  },
  computed: {
    ratingClass () {
      const dRating = this.rating
      let ratingClass = 'zero-three'
      if (dRating < 0) {
        ratingClass = 'hidden'
      } else if (dRating < 7) {
        ratingClass = 'three-seven'
      } else if (dRating < 11) {
        ratingClass = 'seven-eleven'
      } else {
        ratingClass = 'eleven'
      }
      return ratingClass
    },
    star () {
      const dRating = this.rating
      let star = 0
      if (dRating >= 12.5) {
        star = 2
      } else if (dRating >= 12) {
        star = 1
      }
      return star
    }
  },
  methods: {
    greaterThan (one, two) {
      return one > two
    }
  }
}
</script>

<style scoped>
.indicator {
  background-size: contain;
  text-align: center;
}

.hidden {
  background-image: url('~assets/hidden.png');
}

.hidden .number {
  margin-left: 1px;
  padding-top: 20px;
}

.zero-three {
  background-image: url('~assets/zero_three.png');
}

.three-seven {
  background-image: url('~assets/three_seven.png');
}

.seven-eleven {
  background-image: url('~assets/seven_eleven.png');
}

.eleven {
  background-image: url('~assets/eleven_.png');
}
</style>
