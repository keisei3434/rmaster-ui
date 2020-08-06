import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import DatetimePicker from 'vuetify-datetime-picker'

import { extend, localize } from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja'
import isURL from 'validator/es/lib/isURL';
import * as rules from 'vee-validate/dist/rules'

for (const rule in rules) {
  extend(rule, rules[rule])
}

const hiragana = /^[\u3040-\u309f\u0020\u00a0\u3000\u30fb\u30fc]+$/;
const isHiragana = {
  message: field => field + ' は平仮名で入力してください',
  validate: value => hiragana.test(value)
};
extend('isHiragana', isHiragana);

const isURLFromValidator = {
  message: field => field + ' はURLを入力してください',
  validate: value => isURL(value, { require_protocol: true })
}

extend('isURL', isURLFromValidator);

localize('ja', ja)

Vue.config.productionTip = false

Vue.use(DatetimePicker)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
