import Vue from 'vue'
import Router from 'vue-router'
import PlaceControl from './pages/PlaceControl.vue'
import UserControl from './pages/UserControl.vue'
import Match from './pages/Match.vue'
import PracticeControl from './pages/PracticeControl.vue'
import Schedule from './pages/Schedule.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'match',
      component: Match
    },
    {
      path: '/place_control',
      name: 'placeControl',
      component: PlaceControl
    },
    {
      path: '/practice_control',
      name: 'practiceControl',
      component: PracticeControl
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: Schedule
    },
    {
      path: '/user_control',
      name: 'userControl',
      component: UserControl
    }
  ]
})