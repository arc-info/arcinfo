<template>
  <div>
    <b-row>
      <b-col md="4">
        <h3>{{ $t('missions.target_songs') }}</h3>
        {{ $t('missions.click_to_see') }}
        <b-list-group>
          <b-list-group-item v-for="(song, index) of record.target_songs" :key="index" button :active="selected === index" @click="viewConditions(song)">
            <b-badge
              :style="{ 'background-color': getBackColorByPack(packs[songs[song.song_id].set].id) }"
              :class="getTextColorByPack(packs[songs[song.song_id].set].id)"
            >
              {{ Object.prototype.hasOwnProperty.call(packs[songs[song.song_id].set].name_localized, $i18n.locale) ? packs[songs[song.song_id].set].name_localized[$i18n.locale] : packs[songs[song.song_id].set].name_localized.en }}
            </b-badge>
            <br>
            {{ Object.prototype.hasOwnProperty.call(songs[song.song_id].title_localized, $i18n.locale) ? songs[song.song_id].title_localized[$i18n.locale] : songs[song.song_id].title_localized.en }}
            <b-badge v-if="song.difficulties.includes(0) || song.difficulties.length === 0" variant="info">
              PST
            </b-badge>
            <b-badge v-if="song.difficulties.includes(1) || song.difficulties.length === 0" variant="success">
              PRS
            </b-badge>
            <b-badge v-if="song.difficulties.includes(2) || song.difficulties.length === 0" variant="danger">
              FTR
            </b-badge>
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col md="8">
        <div v-if="mission.type === 'health' && findSongData(record.stage, record.target_songs[selected].song_id).health_mod !== undefined">
          <h3>{{ $t('missions.health.song_changes') }}</h3>
          <health-mod :healthmod="findSongData(record.stage, record.target_songs[selected].song_id).health_mod" />
        </div>
        <div v-else-if="findSongData(record.stage, record.target_songs[selected].song_id).conditions !== undefined">
          <h3>{{ $t('missions.clear_conditions') }}</h3>
          <conditions :conditions="findSongData(record.stage, record.target_songs[selected].song_id).conditions" />
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Conditions from '~/components/missions/Conditions.vue'
import HealthMod from '~/components/missions/HealthMod.vue'
import colorUtils from '~/utils/colorUtils'

export default {
  components: {
    Conditions,
    HealthMod
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    mission: {
      type: Object,
      default: () => {}
    },
    songs: {
      type: Object,
      default: () => {}
    },
    packs: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selected: 0
    }
  },
  computed: {
    record () {
      return this.user.arcinfo.missions.playing
    }
  },
  methods: {
    findSongData (stage, id) {
      return this.mission.stages[stage].songs.find((song) => {
        return song.id === id
      })
    },
    getBackColorByPack (pack) {
      return colorUtils.getBackColorByPack(pack)
    },
    getTextColorByPack (pack) {
      return colorUtils.isTextDarkByPack(pack) ? 'text-dark' : 'text-light'
    }
  }
}
</script>

<style scoped>

</style>
