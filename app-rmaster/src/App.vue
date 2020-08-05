<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" clipped>
      <v-container>
        <v-list dense nav>
          <v-list-item v-for="nav_list in nav_lists" :key="nav_list.name" :to="nav_list.link">
            <v-list-item-icon>
              <v-icon>{{ nav_list.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ nav_list.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
    </v-navigation-drawer>
    <v-app-bar color="primary" dark app clipped-left>
      <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>rm *</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outlined>ログイン</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data(){
    return{
        drawer: null,
        nav_lists:[
          {name: '試合',icon: 'mdi-battlenet', link: '/'},
          {name: '練習予定',icon: 'mdi-clock-time-eight-outline', link: '/schedule'},
          {name: 'ユーザー登録',icon: 'mdi-account', link: '/user_control'},
          {name: '施設登録',icon: 'mdi-warehouse', link: '/place_control'},
          {name: '練習日登録',icon: 'mdi-notebook-edit-outline', link: '/practice_control'}
        ]
    }
  }
}
</script>