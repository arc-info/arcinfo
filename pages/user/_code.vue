/* eslint-disable vue/no-parsing-error */
<template>
  <div>
    <div v-if="code === ''">
      <b-container>
        {{ $t('loading') }}
      </b-container>
    </div>
    <div v-else-if="code === 200">
      <b-container class="p-0">
        <profile :user="user" update="true" :status="status" @onUpdate="forceUpdate" />
        <b-container class="m-0">
          <b-tabs>
            <b-tab :title="$t('user.recent_title')">
              <div v-for="(result, index) in user.recent_score" :key="index" class="p-3">
                <play-result
                  isbest="false"
                  :lowest30="lowest30"
                  :rating="user.rating / 100"
                  :best30="best30"
                  :data="result"
                  :songdata="songlist[result.song_id]"
                  :packdata="packlist[songlist[result.song_id].set]"
                />
              </div>
              <div v-if="user.recent_score.length === 0" class="p-5" style="text-align:center;">
                {{ $t('user.norecents') }}
              </div>
            </b-tab>
            <b-tab :title="$t('user.analysis')" lazy>
              <analysis :user="user" :songlist="songlist" />
            </b-tab>
            <b-tab :title="$t('user.missions')" lazy>
              <cleared-missions :user="user" :missions="missions" />
            </b-tab>
          </b-tabs>
        </b-container>
      </b-container>
      <b-container>
        <b-row>
          <b-col sm="auto">
            <span style="font-size: 24pt;">{{ $t('user.best_title') }} </span>
          </b-col>
          <b-col class="my-auto">
            <b-badge variant="info">
              {{ $t('user.best_30_avg') }}
            </b-badge> {{ new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Math.round(best30 * 100) / 100) }}
            <b-badge variant="success">
              {{ $t('user.recent_top_10_avg') }}
            </b-badge>
            {{ (greaterThan(0, user.rating)) ? $t('user.immeasurable') : new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Math.round(getRecentRating(user.rating, best30) * 100) / 100) }}
            <b-icon-question-fill
              v-if="user.rating < 0"
              v-b-popover.hover.top="$t('user.popover.recent_immeasurable.desc')"
              :title="$t('user.popover.recent_immeasurable.title')"
            />
          </b-col>
        </b-row>
        <b-form-group
          class="mb-0 my-auto"
          label-for="filters"
        >
          <b-form-checkbox-group id="filters" v-model="filters" name="filters" size="sm">
            <b-form-checkbox
              v-b-popover.hover.top="$t('user.popover.best30.desc')"
              value="best"
              :title="$t('user.popover.best30.title')"
            >
              {{ $t('user.best_30') }}
              <b-icon-question-fill />
            </b-form-checkbox>
            <b-form-checkbox
              v-b-popover.hover.top="$t('user.popover.target.desc')"
              value="target"
              :title="$t('user.popover.target.title')"
            >
              {{ $t('user.target') }}
              <b-icon-question-fill />
            </b-form-checkbox>
            <b-form-checkbox value="others">
              {{ $t('user.others') }}
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <div style="text-align: right; height: 24px;">
          <b-form-checkbox
            v-model="desc"
            class="my-auto"
            style="float: right;"
            size="sm"
            variant="arcpink"
            switch
          >
            {{ desc ? $t('descend') : $t('ascend') }}
          </b-form-checkbox>
        </div>
        <b-nav class="my-3" variant="arcpink" pills small fill>
          <b-nav-item disabled>
            {{ $t('user.sort_by') }}
          </b-nav-item>
          <b-nav-item :active="sort_type === 'result_rating'" @click="sort_type = 'result_rating'">
            {{ $t('user.sort_options.result_rating') }}
          </b-nav-item>
          <b-nav-item :active="sort_type === 'score'" @click="sort_type = 'score'">
            {{ $t('user.sort_options.score') }}
          </b-nav-item>
          <b-nav-item :active="sort_type === 'detailed_rating'" @click="sort_type = 'detailed_rating'">
            {{ $t('user.sort_options.detailed_rating') }}
          </b-nav-item>
          <b-nav-item :active="sort_type === 'time_played'" @click="sort_type = 'time_played'">
            {{ $t('user.sort_options.time_played') }}
          </b-nav-item>
          <b-nav-item :active="sort_type === 'date_added'" @click="sort_type = 'date_added'">
            {{ $t('user.sort_options.date_added') }}
          </b-nav-item>
        </b-nav>
        <div v-for="(result, index) in user.best_score" :key="index">
          <play-result
            v-show="(filters.includes('target') && isTarget(result.rank, result.song_id, result.difficulty)) || (filters.includes('best') && result.rank <= 30) || (filters.includes('others') && result.rank > 30 && !isTarget(result.rank, result.song_id, result.difficulty))"
            :istarget="isTarget(result.rank, result.song_id, result.difficulty)"
            :lowest30="lowest30"
            :rating="user.rating / 100"
            :best30="best30"
            :data="result"
            :songdata="songlist[result.song_id]"
            :packdata="packlist[songlist[result.song_id].set]"
          />
        </div>
        <div v-if="user.best_score.length === 0" class="p-5" style="text-align:center;">
          {{ $t('user.noscores') }}
        </div>
      </b-container>
    </div>
    <div v-else-if="code === 404">
      <b-container style="text-align: center;">
        <h2>{{ $t('user.notfound') }}</h2><p>{{ $t('user.click_update') }}</p>
        <b-button :variant="translatedStatus()" @click="forceUpdate">
          <b-icon-arrow-repeat v-if="status === 'pending'" />
          <b-spinner v-else-if="status === 'updating'" type="grow" style="width: 1rem; height: 1rem;" />
          <b-icon-check v-if="status === 'success'" />
          <b-icon-alert-triangle-fill v-if="status === 'error'" />
        </b-button>
      </b-container>
    </div>
    <div v-else>
      <b-container>
        <p>{{ $t('error') }}</p>
        <p>{{ $t('code') + ' ' + code }}</p>
      </b-container>
    </div>
  </div>
</template>

<script>

import Profile from '~/components/Profile.vue'
import PlayResult from '~/components/PlayResult.vue'
import Analysis from '~/components/Analysis.vue'
import ClearedMissions from '~/components/missions/ClearedMissions.vue'

export default {
  components: {
    Profile,
    PlayResult,
    Analysis,
    ClearedMissions
  },
  validate ({ params }) {
    return /^\d{9}$/.test(params.code)
  },
  async asyncData ({ $axios, params }) {
    const ret = {}
    const data = await $axios.$get('/api/user/id/' + params.code + '?no_update=true')
    if (data.success) {
      const userinfo = data.value
      const songlist = await $axios.$get('/api/song/')
      const packlist = await $axios.$get('/api/pack/')
      const missions = await $axios.$get('/api/mission/')
      ret.missions = missions.value
      ret.songlist = songlist.value
      ret.packlist = packlist.value
      ret.code = 200
      userinfo.best_score.sort((a, b) => {
        if (isNaN(b.rating)) { b.rating = -1 }
        if (isNaN(a.rating)) { a.rating = -1 }
        return b.rating - a.rating
      })
      let best30 = 0
      let lowest30 = 0
      for (let i = 0; i < userinfo.best_score.length; i++) {
        if (i < 30) { best30 += userinfo.best_score[i].rating / 30 }
        if (i === 29) { lowest30 = userinfo.best_score[i].rating }
        userinfo.best_score[i].rank = i + 1
      }
      ret.lowest30 = lowest30
      ret.best30 = best30
      ret.user = userinfo
      ret.title = userinfo.name + ' - ARCINFO'
    } else {
      ret.code = data.error_code
      ret.title = 'Error! - ARCINFO'
    }
    return ret
  },
  data () {
    return {
      code: '',
      title: this.$t('loading') + ' - ARCINFO',
      status: 'pending',
      sort_type: 'result_rating',
      desc: true,
      filters: ['best', 'target', 'others']
    }
  },
  watch: {
    sort_type (val) {
      const bestScore = this.user.best_score.slice()
      const self = this
      new Promise(function (resolve, reject) {
        resolve(bestScore.sort(self.sortMethod(self, val, self.desc)))
      }).then(function (sorted) {
        self.user.best_score = sorted
      })
    },
    desc (val) {
      const bestScore = this.user.best_score.slice()
      const self = this
      new Promise(function (resolve, reject) {
        resolve(bestScore.sort(self.sortMethod(self, self.sort_type, val)))
      }).then(function (sorted) {
        self.user.best_score = sorted
      })
    }
  },
  methods: {
    async forceUpdate () {
      this.status = 'updating'
      const data = await this.$axios.$get('/api/user/id/' + this.$route.params.code + '?force_update=true')
      if (data.success) {
        const userinfo = data.value
        const songlist = await this.$axios.$get('/api/song/')
        const packlist = await this.$axios.$get('/api/pack/')
        this.status = 'success'
        this.code = 200
        this.title = userinfo.name + ' - ARCINFO'
        userinfo.best_score.sort((a, b) => {
          if (isNaN(b.rating)) { b.rating = -1 }
          if (isNaN(a.rating)) { a.rating = -1 }
          return b.rating - a.rating
        })
        let best30 = 0
        let lowest30 = 0
        for (let i = 0; i < userinfo.best_score.length; i++) {
          if (i < 30) { best30 += userinfo.best_score[i].rating / 30 }
          if (i === 29) { lowest30 = userinfo.best_score[i].rating }
          userinfo.best_score[i].rank = i + 1
        }
        if (this.sort_type !== 'result_rating') { userinfo.best_score.sort(this.sortMethod(this, this.sort_type, this.desc)) }
        this.lowest30 = lowest30
        this.best30 = best30
        this.user = userinfo
        this.songlist = songlist.value
        this.packlist = packlist.value
        this.$bvToast.toast(this.$t('user.toast.updated.desc', { user: userinfo.name }), {
          title: this.$t('user.toast.updated.title'),
          variant: 'success',
          toaster: 'b-toaster-bottom-right'
        })
      } else if (!data.success) {
        this.status = 'error'
        let errorCodeDescription = this.$t('user.toast.error.reason')
        if (data.error_code === 601) {
          errorCodeDescription = this.$t('user.toast.error.reason_601')
        } else if (data.error_code === 404) {
          errorCodeDescription = this.$t('user.toast.error.reason_404')
        }
        this.$bvToast.toast(this.$t('user.toast.error.desc', { reason: errorCodeDescription, code: data.error_code }), {
          title: this.$t('user.toast.error.title'),
          variant: 'danger',
          toaster: 'b-toaster-bottom-right'
        })
      }
    },
    sortMethod (self, type, desc) {
      if (desc) {
        switch (type) {
          case 'score':
            return function (a, b) {
              return b.score - a.score
            }
          case 'detailed_rating':
            return function (a, b) {
              return self.songlist[b.song_id].difficulties[b.difficulty].detailed_rating - self.songlist[a.song_id].difficulties[a.difficulty].detailed_rating
            }
          case 'time_played':
            return function (a, b) {
              return new Date(b.time_played).getTime() - new Date(a.time_played).getTime()
            }
          case 'date_added':
            return function (a, b) {
              return new Date(self.songlist[b.song_id].date).getTime() - new Date(self.songlist[a.song_id].date).getTime()
            }
          default:
            return function (a, b) {
              return b.rating - a.rating
            }
        }
      } else {
        switch (type) {
          case 'score':
            return function (a, b) {
              return a.score - b.score
            }
          case 'detailed_rating':
            return function (a, b) {
              return self.songlist[a.song_id].difficulties[b.difficulty].detailed_rating - self.songlist[b.song_id].difficulties[a.difficulty].detailed_rating
            }
          case 'time_played':
            return function (a, b) {
              return new Date(a.time_played).getTime() - new Date(b.time_played).getTime()
            }
          case 'date_added':
            return function (a, b) {
              return new Date(self.songlist[a.song_id].date).getTime() - new Date(self.songlist[b.song_id].date).getTime()
            }
          default:
            return function (a, b) {
              return a.rating - b.rating
            }
        }
      }
    },
    sortNow (type, desc) {
      this.user.best_score.sort(this.sortMethod(type, desc))
    },
    isTarget (rank, songId, difficulty) {
      if (rank <= 30) { return false }
      const drating = this.songlist[songId].difficulties[difficulty].detailed_rating
      if (this.lowest30 < drating + 2 && (this.user.rating + 1 >= drating || this.user.rating < 0)) { return true }
      return false
    },
    getRecentRating (rating, best30) {
      return ((rating / 100) * 4) - (best30 * 3)
    },
    translatedStatus () {
      let colorVarient = 'secondary'
      if (this.status === 'updating') {
        colorVarient = 'primary'
      } else if (this.status === 'success') {
        colorVarient = 'success'
      } else if (this.status === 'error') {
        colorVarient = 'danger'
      }
      return colorVarient
    },
    greaterThan (one, two) {
      return one > two
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

<style scoped>
#notfound {
  display: none;
}

#userinfo {
  display: none;
}

#error {
  display: none;
}

.tab-title {
  font-size: 24pt;
}
</style>
