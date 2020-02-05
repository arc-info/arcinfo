export default {
  get_score (detailedRating, targetRating) {
    const scoreMod = targetRating - detailedRating
    if (scoreMod < -30) {
      // target score is too low
      return -2
    }
    if (scoreMod > 2) {
      // target score is too high
      return -1
    }
    if (scoreMod === 2) {
      return 10000000
    } else if (scoreMod >= 1.5) {
      return (((scoreMod - 1.5) * 100000) + 9950000) > 10000000 ? 10000000 : ((scoreMod - 1.5) * 100000) + 9950000
    } else if (scoreMod >= 1.0) {
      return (((scoreMod - 1.0) * 400000) + 9800000) > 9950000 ? 9950000 : ((scoreMod - 1.0) * 400000) + 9800000
    }
    return ((scoreMod * 300000) + 9500000) > 9800000 ? 9800000 : ((scoreMod * 300000) + 9500000)
  },
  calculate_modifier (score) {
    let modifier = 0
    if (score > 10000000) {
      modifier = 2
    } else if (score > 9949999) {
      modifier = 1.5 + ((score - 9950000) / 100000)
    } else if (score > 9799999) {
      modifier = 1.0 + ((score - 9800000) / 400000)
    } else {
      modifier = ((score - 9500000) / 300000)
    }
    return modifier
  },
  get_rating (detailedRating, targetScore) {
    return Math.max(detailedRating + this.calculate_modifier(targetScore), 0)
  },
  get_detailed_rating (rating, score) {
    return Math.round((rating - this.calculate_modifier(score)) * 10) / 10
  }
}
