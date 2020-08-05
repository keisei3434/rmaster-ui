<template>
  <ul id="example-1">
    <li v-for="practice in practices" :key="practice.id">
      {{ practice.name }}
    </li>
  </ul>
</template>

<script>
import axios from 'axios'
export default {
  name: 'PracticeControl',
  data: function () {
    return {
      practices: []
    }
  },
  mounted: function(){
    axios.get('http://54.150.76.124/api/practice')
    .then(response => (this.practices = response.data))
  }
}
</script>

<style scoped>
</style>