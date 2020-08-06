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
          <ValidationProvider name="練習日" rules="required|max:25" v-slot="{ errors }">
            <v-text-field
              :counter="25"
              single-line
              label="練習日 *"
              v-model="placticeName"
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
          <ValidationProvider name="名前" rules="required|max:25" v-slot="{ errors }">
            <v-text-field
              :counter="25"
              single-line
              v-model="practice.start_at"
              label="名前 *"
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
import { ValidationProvider, ValidationObserver } from 'vee-validate';

const apiHost = 'http://54.150.76.124'
const practiceApiPath = apiHost + '/api/practice'

export default {
  name: 'ScheduleControl',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: function () {
    return {
      startAt: '',
      link: '',
      practices: [],
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
      axios.post(practiceApiPath, { 
        start_at: this.startAt, 
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
        start_at: this.practices[index].startAt
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
    init_add: function () {
      this.startAt = ''
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