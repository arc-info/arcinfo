<template>
  <b-container style="text-align: left;">
    <h2>{{ $t('missions.title') }}</h2>
    <div v-if="$route.params.code === undefined || $route.params.code.length !== 9">
      <b-container>
        <b-input-group size="lg" @keydown.enter.prevent @submit.prevent>
          <b-form-input
            v-model="user_code"
            :placeholder="$t('missions.placeholder')"
            :aria-placeholder="$t('missions.placeholder')"
            @keydown.enter.prevent
            @submit.prevent
            @keyup.enter="goMissions"
          />
          <b-input-group-append>
            <b-button variant="secondary" @keydown.enter.prevent @submit.prevent @click="goMissions">
              {{ $t('missions.go') }}
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-container>
    </div>
    <div v-else-if="status === 'select'">
      <recent-record :mission="recentMission" :songs="songs" :user="user" :playing="isPlaying()" />
      <mission-select
        :missions="missions"
        :songs="songs"
        :packs="packs"
        :missionpacks="missionPacks"
        :user="user"
        @select="missionSelect"
      />
    </div>
    <div v-else-if="status === 'play'">
      <recent-record :mission="recentMission" :songs="songs" :user="user" :playing="isPlaying()" />
      <b-row class="p-4">
        <b-col md="3">
          <h2 v-if="code === 603">
            {{ $t('missions.time_limit') }}
          </h2>
          <div style="text-align: center;" class="py-3">
            <client-only>
              <countdown :time="count" style="font-size: 2rem;" @end="checkResult">
                <template slot-scope="props">
                  {{ props.minutes }}:{{ new Intl.NumberFormat('en-US', {minimumIntegerDigits: 2}).format(props.seconds) }}
                </template>
              </countdown>
              <br>
            </client-only>
            <b-button variant="primary" @click="checkResult">
              <b-spinner v-show="checking" />
              <span v-show="!checking">{{ $t('missions.check') }}</span>
            </b-button>
          </div>
        </b-col>
        <b-col md="9">
          <target-songs :user="user" :songs="songs" :packs="packs" :mission="recentMission" />
        </b-col>
      </b-row>
    </div>
    <div v-else-if="status === 'loading'">
      <b-container>
        <p>{{ $t('loading') }}</p>
      </b-container>
    </div>
    <div v-else>
      <b-container style="text-align:center;">
        <h2>{{ $t('error') }}</h2>
        <p>{{ $t('code') + ' ' + code }}</p>
        <p v-if="code === 404">
          {{ $t('missions.notfound') }}
        </p>
        <b-button v-if="code === 404" :to="localePath('/user/' + $route.params.code)">
          {{ $t('missions.find') }}
        </b-button>
      </b-container>
    </div>
  </b-container>
</template>

<script>
import MissionSelect from '~/components/missions/MissionSelect.vue'
import RecentRecord from '~/components/missions/RecentRecord.vue'
import TargetSongs from '~/components/missions/TargetSongs.vue'

export default {
  components: {
    MissionSelect,
    RecentRecord,
    TargetSongs
  },
  async asyncData ({ $axios, params }) {
    if (params.code === undefined || params.code.length !== 9 || isNaN(params.code)) {
      return {}
    }
    const ret = {}
    const missionReq = await $axios.$get('/api/mission/')
    const missionPackReq = await $axios.$get('/api/mission/packs')
    const songsReq = await $axios.$get('/api/song')
    const packsReq = await $axios.$get('/api/pack')
    const userReq = await $axios.$get('/api/user/id/' + params.code + '?no_update=true')
    if (missionReq.success && userReq.success && missionPackReq.success && songsReq.success && packsReq.success) {
      const missions = missionReq.value
      const missionPacks = missionPackReq.value
      const user = userReq.value
      const songs = songsReq.value
      const packs = packsReq.value
      ret.code = 200
      ret.missions = missions
      ret.missionPacks = missionPacks
      ret.songs = songs
      ret.packs = packs
      ret.user = user
      if (user.arcinfo === undefined || user.arcinfo.missions === undefined || user.arcinfo.missions.playing === undefined) {
        user.arcinfo = {
          missions: {
            playing: {
              cleared: false,
              failed: false,
              id: null,
              time_stage_started: 0,
              records: []
            }
          }
        }
      }
      ret.title = 'Missions - ARCINFO'
    } else {
      if (!missionReq.success) {
        ret.code = missionReq.error_code
      } else if (!userReq.success) {
        ret.code = userReq.error_code
      } else if (!missionPackReq.success) {
        ret.code = missionPackReq.error_code
      } else if (!songsReq.success) {
        ret.code = songsReq.error_code
      } else {
        ret.code = packsReq.error_code
      }
      ret.title = 'Error! - ARCINFO'
    }
    return ret
  },
  data () {
    let title = this.$t('loading') + ' - ARCINFO'
    if (this.$route.params.code === undefined || this.$route.params.code.length !== 9) {
      title = this.$t('missions.title') + ' - ARCINFO'
    }
    return {
      user_code: '',
      code: '',
      title,
      checking: false
    }
  },
  computed: {
    status () {
      if (this.user === undefined && this.code === '') {
        return 'loading'
      } else if (this.code !== 200) {
        return 'error'
      } else if (this.isPlaying()) {
        return 'play'
      } else if (this.code === 200) {
        return 'select'
      }
      return 'error'
    },
    count () {
      if (this.user === undefined || !Object.prototype.hasOwnProperty.call(this.user.arcinfo.missions.playing, 'time_stage_started')) {
        return -1
      }
      const stageEnd = new Date(this.user.arcinfo.missions.playing.time_stage_started).getTime() + 3.5 * 60000
      return stageEnd - Date.now()
    },
    recentMission () {
      if (this.user === undefined || !Object.prototype.hasOwnProperty.call(this.user.arcinfo.missions.playing, 'id')) {
        return {}
      }
      return this.missions[this.user.arcinfo.missions.playing.id]
    }
  },
  methods: {
    isPlaying () {
      const missionData = this.user.arcinfo.missions.playing
      if (
        Object.prototype.hasOwnProperty.call(missionData, 'id') &&
        (typeof missionData.id) === 'string' &&
        missionData.failed !== true &&
        missionData.cleared !== true &&
        (Date.now() - (new Date(missionData.time_stage_started).getTime())) < 3.5 * 60000
      ) {
        return true
      }
      return false
    },
    goMissions () {
      if (this.user_code.replace(/ /g, '').length === 9 && !isNaN(this.user_code.replace(/ /g, ''))) {
        this.$router.push(this.localePath('/missions/' + this.user_code.replace(/ /g, '')))
      }
    },
    isPlayable (mission) {
      if (Object.prototype.hasOwnProperty.call(mission, 'play_conditions')) {
        for (const [index, condition] of Object.entries(mission.play_conditions)) {
          switch (index) {
            case 'rating':
              if (!this.isInRange(condition, this.user.rating)) { return false }
          }
        }
      }
      const missionPack = this.missionPacks[mission.set]
      if ((Object.prototype.hasOwnProperty.call(missionPack, 'time_start') && new Date(missionPack.time_start).getTime() > Date.now()) || (Object.prototype.hasOwnProperty.call(missionPack, 'time_expire') && new Date(missionPack.time_expire).getTime() < Date.now())) {
        return false
      }
      return true
    },
    async missionSelect (mission) {
      if (this.isPlayable(mission)) {
        const userReq = await this.$axios.$get('/api/user/mission/play/' + this.$route.params.code + '?mission=' + mission.id)
        if (userReq.success) {
          this.user = userReq.value.user
        } else {
          this.code = userReq.error_code
        }
      }
    },
    async checkResult () {
      console.log('CHECKING...')
      this.checking = true
      const userReq = await this.$axios.$get('/api/user/mission/forcecheck/' + this.$route.params.code)
      if (userReq.success) {
        this.user = userReq.value.user
      } else {
        this.code = userReq.error_code
      }
      this.checking = false
    },
    isInRange (rangeObj, number) {
      const more = !isNaN(rangeObj.more_than) ? rangeObj.more_than : -1
      const less = !isNaN(rangeObj.less_than) ? rangeObj.less_than : Infinity
      const num = !isNaN(number) ? number : 0
      if (more > less) {
        return (num >= more || num <= less)
      }
      return (num >= more && num <= less)
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

</style>
