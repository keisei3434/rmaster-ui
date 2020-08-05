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
              v-model="userName"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>
          <ValidationProvider name="名前(かな)" rules="required|max:25|isHiragana" v-slot="{ errors }">
            <v-text-field
              :counter="25"
              single-line
              label="名前(かな) *"
              v-model="userNameKana"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>
          <v-radio-group v-model="gender" row>
            <v-radio label="男性" :value="1"></v-radio>
            <v-radio label="女性" :value="2"></v-radio>
          </v-radio-group>      
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
      v-for="(user, index) in users" :key="user.id"
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
              v-model="user.name"
              label="名前*"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>
          <ValidationProvider name="名前(かな)" rules="required|max:25|isHiragana" v-slot="{ errors }">
            <v-text-field
              :counter="25"
              single-line
              v-model="user.name_kana"
              label="名前(かな)*"
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>
          <v-radio-group v-model="user.gender" row>
            <v-radio label="男性" :value="1"></v-radio>
            <v-radio label="女性" :value="2"></v-radio>
          </v-radio-group>      
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              outlined 
              color="primary" 
              :data_id=user.id 
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
              :data_id=user.id 
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
const userApiPath = apiHost + '/api/user'

export default {
  name: 'UserControl',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: function () {
    return {
      userName: '',
      userNameKana: '',
      gender: 1,
      users: [],
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
      axios.post(userApiPath, { 
        name: this.userName, 
        name_kana: this.userNameKana, 
        gender: this.gender 
      })
      .then(this.get)
      .then(this.init_add)
      .then(this.$refs.observer.reset())
      .finally(() => this.loading = false)
    },
    update: function () {
      const index = event.currentTarget.getAttribute('data_index')
      this.selectedUpdateIndex = index
      axios.patch(userApiPath + '/' + this.users[index].id, { 
        name: this.users[index].name, 
        name_kana: this.users[index].name_kana, 
        gender: this.users[index].gender 
      })
      .then(this.get)
      .finally(() => {
          this.selectedUpdateIndex = null
        }
      )
    },
    remove: function () {
      axios.delete(userApiPath + '/' + this.selectedDeleteId)
      .then(this.get)
      .then(this.dialog = false)
    },
    get: function () {
      axios.get(userApiPath)
      .then(response => (this.users = response.data.reverse()))
    },
    init_add: function () {
      this.userName = ''
      this.userNameKana = ''
      this.gender = 1
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