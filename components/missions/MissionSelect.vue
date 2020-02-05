<template>
  <b-container style="text-align: left;" class="m-0">
    <h2>{{ $t('missions.select') }}</h2>
    <div v-if="maintenance">
      Due to maintenance, Missions are currently not playable.<br>
      점검으로 인해 현재 미션은 플레이 불가능합니다.
    </div>
    <b-form-checkbox v-model="seeNotAvailable" switch>
      {{ $t('missions.view_not_available') }}
    </b-form-checkbox>
    <div v-for="[index, missionPack] of Object.entries(missionByPacks)" :key="index">
      <b-container v-show="!isNotAvailable(missionpacks[index]) || seeNotAvailable" :style="{ 'background-color': missionpacks[index].background_color }" :class="missionpacks[index].text_light === true ? 'text-light' : 'text-dark'">
        <div v-b-toggle="index + '_collapse'" style="cursor: pointer">
          <h2>
            {{ Object.prototype.hasOwnProperty.call(missionpacks[index].name_localized, $i18n.locale) ? missionpacks[index].name_localized[$i18n.locale] : missionpacks[index].name_localized.en }}
            <b-badge v-if="isNotAvailable(missionpacks[index])" variant="secondary">
              {{ $t('missions.not_available') }}
            </b-badge>
          </h2>
          <h5>{{ Object.prototype.hasOwnProperty.call(missionpacks[index].description_localized, $i18n.locale) ? missionpacks[index].description_localized[$i18n.locale] : missionpacks[index].description_localized.en }}</h5>
          <p v-if="hasTimeLimit(missionpacks[index])">
            {{ timeAlert(missionpacks[index]) }}
          </p>
        </div>
        <b-collapse :id="index + '_collapse'" accordion="missionPack">
          <div v-for="(mission, mIndex) of missionPack" :key="mIndex">
            <b-container :style="{ 'background-color': mission.background_color }" :class="mission.text_light === true ? 'text-light' : 'text-dark'">
              <div v-b-toggle="index + '_' + mIndex + '_collapse'" style="cursor: pointer">
                <h2>
                  {{ Object.prototype.hasOwnProperty.call(mission.name_localized, $i18n.locale) ? mission.name_localized[$i18n.locale] : mission.name_localized.en }}
                  <b-badge v-if="isCleared(mission.id) !== false" variant="info">
                    {{ $t('missions.cleared') }}
                  </b-badge>
                  <b-badge v-if="isCleared(mission.id) !== false" variant="success">
                    {{ Object.prototype.hasOwnProperty.call(mission.clear_comment_localized[isCleared(mission.id)], $i18n.locale) ? mission.clear_comment_localized[isCleared(mission.id)][$i18n.locale] : mission.clear_comment_localized[isCleared(mission.id)].en }}
                  </b-badge>
                </h2>
                <h5>{{ Object.prototype.hasOwnProperty.call(mission.description_localized, $i18n.locale) ? mission.description_localized[$i18n.locale] : mission.description_localized.en }}</h5>
              </div>
              <b-collapse :id="index + '_' + mIndex + '_collapse'">
                <div class="p-1">
                  <b-badge variant="secondary">
                    {{ $t('missions.type') }}
                  </b-badge>
                  {{ mission.type === 'health' ? $t('missions.type_health') : $t('missions.type_conditions') }}
                  <div v-if="mission.type === 'health'">
                    <b-badge variant="danger">
                      {{ $t('missions.health.start_health') }}
                    </b-badge>
                    {{ mission.mission_health }}
                    <h5>{{ $t('missions.health.changes') }}</h5>
                    <health-mod :healthmod="mission.health_mod !== undefined ? mission.health_mod : {}" />
                  </div>
                  <div v-else>
                    <h5>{{ $t('missions.clear_conditions') }}</h5>
                    <conditions :conditions="mission.conditions.length === 0 ? {} : mission.conditions" />
                  </div>
                </div>
                <div class="p-1">
                  <div v-b-toggle="mIndex + '_stages'" style="cursor: pointer">
                    <h5>
                      {{ $t('missions.stages') }}
                      <b-button size="sm" variant="secondary">
                        {{ $t('view') }}
                      </b-button>
                    </h5>
                  </div>
                  <b-collapse :id="mIndex + '_stages'">
                    <div v-for="(stage, sIndex) of mission.stages" :key="sIndex" class="p-2">
                      <h5>
                        {{ $t('missions.stage', { num: sIndex + 1 }) }}
                      </h5>
                      <span v-for="(song, songIndex) of stage.songs" :key="songIndex">
                        {{ Object.prototype.hasOwnProperty.call(songs[song.id].title_localized, $i18n.locale) ? songs[song.id].title_localized[$i18n.locale] : songs[song.id].title_localized.en }}
                        <b-badge v-if="song.difficulties.includes(0) || song.difficulties.length === 0" variant="info">PST</b-badge>
                        <b-badge v-if="song.difficulties.includes(1) || song.difficulties.length === 0" variant="success">PRS</b-badge>
                        <b-badge v-if="song.difficulties.includes(2) || song.difficulties.length === 0" variant="danger">FTR</b-badge>
                        <br></span>
                    </div>
                  </b-collapse>
                </div>
                <div class="text-right">
                  <b-button v-b-modal="mission.id + '_rankings'" variant="secondary" @click="showRanking(mission.id)">
                    {{ $t('missions.ranking') }}
                  </b-button>
                  <b-button v-b-modal.warning-modal variant="primary" :disabled="isNotAvailable(missionpacks[index])" @click="selected = mission.id">
                    {{ $t('missions.start') }}
                  </b-button>
                </div>
              </b-collapse>
            </b-container>
          </div>
        </b-collapse>
      </b-container>
    </div>
    <b-modal id="warning-modal" :title="$t('missions.warning.title')" :ok-title="$t('missions.start')" :cancel-title="$t('missions.warning.cancel')" @ok="missionStart()">
      {{ $t('missions.warning.intro') }}
      <ul>
        <li>{{ $t('missions.warning.one') }}</li>
        <li>{{ $t('missions.warning.two') }}</li>
        <li>{{ $t('missions.warning.three') }}</li>
        <li>{{ $t('missions.warning.four') }}</li>
      </ul>
      {{ $t('missions.warning.outtro') }}
    </b-modal>
    <rankings :mission="missions[ranking]" :me="user.user_code" />
  </b-container>
</template>

<script>
/* eslint-disable object-shorthand */
// import Song from '~/components/Song.vue'
import HealthMod from '~/components/missions/HealthMod.vue'
import Conditions from '~/components/missions/Conditions.vue'
import Rankings from '~/components/missions/Rankings.vue'

export default {
  components: {
    HealthMod,
    Conditions,
    Rankings
  },
  props: {
    missions: {
      type: Object,
      default: () => {}
    },
    songs: {
      type: Object,
      default: () => {}
    },
    user: {
      type: Object,
      default: () => {}
    },
    missionpacks: {
      type: Object,
      default: () => {}
    },
    packs: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    const missionByPacks = {}
    // eslint-disable-next-line no-unused-vars
    for (const [index, mission] of Object.entries(this.missions)) {
      if (!Array.isArray(missionByPacks[mission.set])) { missionByPacks[mission.set] = [] }
      missionByPacks[mission.set].push(mission)
    }
    for (const [index, missions] of Object.entries(missionByPacks)) {
      missionByPacks[index] = missions.sort((a, b) => {
        return a.priority - b.priority
      })
    }
    return {
      missionByPacks: missionByPacks,
      selected: '',
      ranking: '',
      seeNotAvailable: false,
      maintenance: false
    }
  },
  methods: {
    missionStart () {
      this.$emit('select', this.missions[this.selected])
    },
    isNotAvailable (missionPack) {
      if (this.maintenance) {
        return true
      }
      if (Object.prototype.hasOwnProperty.call(missionPack, 'time_start') && (new Date(missionPack.time_start).getTime() - Date.now()) > 0) {
        return true
      }
      if (Object.prototype.hasOwnProperty.call(missionPack, 'time_expire') && (new Date(missionPack.time_expire).getTime() - Date.now()) < 0) {
        return true
      }
      return false
    },
    hasTimeLimit (missionPack) {
      if (Object.prototype.hasOwnProperty.call(missionPack, 'time_start')) {
        return true
      }
      if (Object.prototype.hasOwnProperty.call(missionPack, 'time_expire')) {
        return true
      }
      return false
    },
    timeAlert (missionPack) {
      let timeString = ''
      if (Object.prototype.hasOwnProperty.call(missionPack, 'time_start') && (new Date(missionPack.time_start).getTime() - Date.now()) > 0) {
        timeString += this.$t('missions.starts_in', { time: this.$moment(missionPack.time_start).format('YYYY-MM-DD HH:mm') })
      }
      if (Object.prototype.hasOwnProperty.call(missionPack, 'time_expire')) {
        if (timeString !== '') { timeString += ', ' }
        timeString += this.$t('missions.expired_in', { time: this.$moment(missionPack.time_expire).format('YYYY-MM-DD HH:mm') })
      }
      return timeString
    },
    isCleared (missionId) {
      if (this.user.arcinfo.missions.cleared !== undefined && Object.prototype.hasOwnProperty.call(this.user.arcinfo.missions.cleared, missionId)) {
        return this.user.arcinfo.missions.cleared[missionId].mission_clear_type
      }
      return false
    },
    showRanking (missionId) {
      this.ranking = missionId
      this.$bvModal.show('rankings_modal')
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
