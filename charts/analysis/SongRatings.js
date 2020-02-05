import { Scatter, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Scatter,
  mixins: [reactiveProp],
  data () {
    return {
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            type: 'linear',
            ticks: {
              stepSize: 0.1,
              max: 13
            }
          }],
          yAxes: [{
            type: 'linear',
            ticks: {
              stepSize: 100000
            }
          }]
        },
        tooltips: {
          callbacks: {
            label (tooltipItem, data) {
              const label = data.datasets[0].data[tooltipItem.index].name + ' ' + data.datasets[0].data[tooltipItem.index].difficulty + '(' + data.datasets[0].data[tooltipItem.index].x + '): ' + data.datasets[0].data[tooltipItem.index].y
              return label
            }
          }
        },
        legend: {
          display: false
        }
      }
    }
  },
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
