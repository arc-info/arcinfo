<template>
  <b-modal id="rankings_modal" size="xl" :title="$t('missions.rankings', {mission: localizedTitle})" scrollable lazy>
    <div v-if="Object.prototype.hasOwnProperty.call(rankingMe, 'cleared')" class="my-1">
      <h3>{{ $t('missions.my_rank') }}</h3>
      <ranking :isme="true" :mission="mission" :username="rankingMe.cleared !== undefined ? safeUsername(rankingMe.cleared.user_code) : ''" :record="rankingMe.cleared" :rank="rankingMe.cleared !== undefined ? rankingMe.cleared.array_index : 0" />
    </div>
    <div v-if="ranking.cleared !== undefined && ranking.cleared.length > 0" class="my-1">
      <h3>{{ $t('missions.rank_all') }}</h3>
      <div v-for="(record, index) of ranking.cleared" :key="index">
        <ranking :isme="me === record.user_code" :mission="mission" :username="safeUsername(record.user_code)" :record="record" :rank="index" />
      </div>
    </div>
    <div v-else>
      <h3>{{ $t('missions.rank_all') }}</h3>
      <p style="text-align: center;">
        {{ $t('missions.no_records') }}
      </p>
    </div>
    <template v-slot:modal-footer="{}">
      <b-pagination
        v-model="page"
        class="mx-auto"
        :total-rows="parseInt(size / 100) > (size / 100) ? parseInt(size / 100) + 1 : parseInt(size / 100)"
      />
    </template>
  </b-modal>
</template>

<script>
import Ranking from '~/components/missions/Ranking.vue'

export default {
  components: {
    Ranking
  },
  props: {
    mission: {
      type: Object,
      default: () => {}
    },
    me: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      limit: 100,
      ranking: {},
      rankingMe: {},
      usernames: {},
      page: 1
    }
  },
  computed: {
    localizedTitle () {
      if (this.mission === undefined) {
        return ''
      }
      return Object.prototype.hasOwnProperty.call(this.mission.name_localized, this.$i18n.locale) ? this.mission.name_localized[this.$i18n.locale] : this.mission.name_localized.en
    },
    safeMissionId () {
      if (this.mission === undefined) {
        return ''
      }
      return this.mission.id
    },
    size () {
      if (this.ranking === undefined) { return 0 }
      return this.ranking.size
    },
    skip () {
      return (this.page - 1) * 100
    }
  },
  watch: {
    mission () {
      this.update()
    },
    page () {
      this.update()
    }
  },
  methods: {
    safeUsername (code) {
      if (!Object.prototype.hasOwnProperty.call(this.usernames, code)) {
        return ''
      }
      return this.usernames[code]
    },
    async update () {
      if (this.mission === undefined) { return }
      const ranking = await this.$axios.$get('/api/mission/rank/all/' + this.mission.id + '?skip=' + this.skip + '&limit=' + this.limit)
      const rankingMe = await this.$axios.$get('/api/mission/rank/user/' + this.me + '/' + this.mission.id)
      const userlist = []
      if (ranking.success && ranking.value.length > 0) {
        this.ranking = ranking.value[0]
        for (const record of ranking.value[0].cleared) {
          //
          if (!userlist.includes(record.user_code)) {
            userlist.push(record.user_code)
          }
        }
      } else {
        this.ranking = {}
      }
      if (rankingMe.success && rankingMe.value.length > 0) {
        this.rankingMe = rankingMe.value[0]
        if (!userlist.includes(rankingMe.value[0].cleared.user_code)) {
          userlist.push(rankingMe.value[0].cleared.user_code)
        }
      } else {
        this.rankingMe = {}
      }
      const usernames = await this.$axios.$post('/api/user/usernames/', { codes: userlist })
      if (usernames.success) {
        this.usernames = usernames.value
      } else {
        this.usernames = {}
      }
    }
  }
}
</script>

<style>

</style>
