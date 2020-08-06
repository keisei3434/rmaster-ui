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
          <ValidationProvider name="名前" rules="required|max:25" v-slot="{ errors }">
            <v-text-field
              :counter="25"
              single-line
              label="名前 *"
              v-model="placeName"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>
          <ValidationProvider name="URL" rules="max:1000" v-slot="{ errors }">
            <v-text-field
              :counter="1000"
              single-line
              label="Link"
              v-model="link"
              :error-messages="errors"
            ></v-text-field>
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
      v-for="(place, index) in places" :key="place.id"
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
          <ValidationProvider name="名前" rules="required|max:25" v-slot="{ errors }">
            <v-text-field
              :counter="25"
              single-line
              v-model="place.name"
              label="名前 *"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>
          <ValidationProvider name="Link" rules="isURL|max:1000" v-slot="{ errors }">
            <v-text-field
              :counter="1000"
              single-line
              v-model="place.link"
              label="Link"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>     
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              outlined 
              color="primary" 
              :data_id=place.id 
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
              :data_id=place.id 
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
import { ValidationProvider, ValidationObserver } from 'vee-validate';

const apiHost = 'http://54.150.76.124'
const placeApiPath = apiHost + '/api/place'

export default {
  name: 'PlaceControl',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: function () {
    return {
      placeName: '',
      link: '',
      places: [],
      loading: false,
      dialog: false,
      selectedUpdateIndex: null,
      selectedDeleteId: null,
    }
  },
  mounted: function(){
    this.get()
  },
  methods: {
    add: function () {
      this.loading = true
      axios.post(placeApiPath, { 
        name: this.placeName, 
        link: this.link
      })
      .then(this.get)
      .then(this.init_add)
      .then(this.$refs.observer.reset())
      .finally(() => this.loading = false)
    },
    update: function () {
      const index = event.currentTarget.getAttribute('data_index')
      this.selectedUpdateIndex = index
      axios.patch(placeApiPath + '/' + this.places[index].id, { 
        name: this.places[index].name, 
        link: this.places[index].link,
      })
      .then(this.get)
      .finally(() => {
          this.selectedUpdateIndex = null
        }
      )
    },
    remove: function () {
      axios.delete(placeApiPath + '/' + this.selectedDeleteId)
      .then(this.get)
      .then(this.dialog = false)
    },
    get: function () {
      axios.get(placeApiPath)
      .then(response => (this.places = response.data.reverse()))
    },
    init_add: function () {
      this.placeName = ''
      this.link = ''
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