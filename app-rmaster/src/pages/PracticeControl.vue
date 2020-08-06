<template>
  <v-row>
    <v-col
      cols=12
      xs=6
      sm=6
      md=6
      lg=4
      xl=4
    >
      <v-card
        class="ma-3 pa-4"
        outlined
      >
        <ValidationObserver ref="observer" v-slot="{ invalid }">
          <ValidationProvider name="練習場所" rules="required" v-slot="{ errors }">
            <v-col>
              <v-select
                item-text="name"
                item-value="id"
                :items="places"
                label="練習場所 *"
                v-model="placeId"
                :error-messages="errors"
              ></v-select>
            </v-col>
          </ValidationProvider>
          <ValidationProvider name="練習開始時間" rules="required">
            <VueCtkDateTimePicker 
              v-model="startAt"
              minute-interval=30
              format='YYYY-MM-DD hh:mm'
              label="練習開始時間 *"
            />
          </ValidationProvider>
          <ValidationProvider name="練習終了時間" rules="required">
            <VueCtkDateTimePicker 
              v-model="endAt"
              minute-interval=30
              format='YYYY-MM-DD hh:mm'
              label="練習終了時間 *"
            />
          </ValidationProvider>  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              outlined
              color="primary"
              v-on:click="add"
              :loading="loading"
              :disabled="loading || invalid"
            >
              新規追加
            </v-btn>
          </v-card-actions>
        </ValidationObserver>
      </v-card>
    </v-col>
    <v-col
      v-for="(practice, index) in practices" :key="practice.id"
      cols=12
      xs=6
      sm=6
      md=6
      lg=4
      xl=4
    >
      <v-card
        class="ma-3 pa-4"
        outlined
      >
        <ValidationObserver v-slot="{ invalid }">
          <ValidationProvider name="練習場所" rules="required" v-slot="{ errors }">
            <v-text-field
              single-line
              label="練習場所 *"
              v-model="practice.place_id"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>
          <ValidationProvider name="練習開始時間" rules="required" v-slot="{ errors }">
            <v-text-field
              :counter="25"
              single-line
              v-model="practice.start_at"
              label="練習開始時間 *"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider> 
          <ValidationProvider name="練習終了時間" rules="required" v-slot="{ errors }">
            <v-text-field
              :counter="25"
              single-line
              v-model="practice.end_at"
              label="練習終了時間 *"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              outlined 
              color="primary" 
              :data_id=practice.id 
              :data_index=index
              v-on:click="update"
              :disabled="index == selectedUpdateIndex || invalid"
              :loading="index == selectedUpdateIndex"
            >
              保存
            </v-btn>
            <v-btn 
              outlined 
              color="error" 
              :data_id=practice.id 
              v-on:click="open_delete_modal"
            >
              削除
            </v-btn>
          </v-card-actions>
        </ValidationObserver>
      </v-card>
    </v-col>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title style="font-size:1.25em">本当に削除しますか？</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            outlined 
            color="primary"
            @click="remove"
          >
            はい
          </v-btn>
          <v-btn
            outlined 
            color="error" 
            @click="dialog = false"
          >
            いいえ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';


const apiHost = 'http://54.150.76.124'
const practiceApiPath = apiHost + '/api/practice'
const placeApiPath = apiHost + '/api/place'

export default {
  name: 'PracticeControl',
  components: {
    ValidationProvider,
    ValidationObserver,
    VueCtkDateTimePicker
  },
  data: function () {
    return {
      placeId: null,
      startAt: '',
      endAt: '',  
      practices: [],
      places: [],
      loading: false,
      dialog: false,
      selectedUpdateIndex: null,
      selectedDeleteId: null,
    }
  },
  mounted: function(){
    this.get()
    this.getPlaces()
  },
  methods: {
    add: function () {
      this.loading = true
      axios.post(practiceApiPath, { 
        place_id: this.placeId,
        start_at: this.startAt, 
        end_at: this.endAt, 
      })
      .then(this.get)
      .then(this.init_add)
      .then(this.$refs.observer.reset())
      .finally(() => this.loading = false)
    },
    update: function () {
      const index = event.currentTarget.getAttribute('data_index')
      this.selectedUpdateIndex = index
      axios.patch(practiceApiPath + '/' + this.practices[index].id, { 
        place_id: this.practices[index].place_id,
        start_at: this.practices[index].start_at,
        end_at: this.practices[index].end_at
      })
      .then(this.get)
      .finally(() => {
          this.selectedUpdateIndex = null
        }
      )
    },
    remove: function () {
      axios.delete(practiceApiPath + '/' + this.selectedDeleteId)
      .then(this.get)
      .then(this.dialog = false)
    },
    get: function () {
      axios.get(practiceApiPath)
      .then(response => (this.practices = response.data.reverse()))
    },
    getPlaces: function () {
      axios.get(placeApiPath)
      .then(response => (this.places = response.data.reverse()))
    },
    init_add: function () {
      this.placeId = null
      this.startAt = ''
      this.endAt = ''
    },
    open_delete_modal: function () {
      this.dialog = true
      this.selectedDeleteId = event.currentTarget.getAttribute('data_id')
    }
  }
}
</script>

<style scoped>
</style>