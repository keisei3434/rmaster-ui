<template>
  <ul id="example-1">
    <li v-for="match in matches" :key="match.id">
      {{ match.name }}
    </li>
  </ul>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MatchControl',
  data: function () {
    return {
      matches: []
    }
  },
  mounted: function(){
    axios.get('http://54.150.76.124/api/match')
    .then(response => (this.matches = response.data))
  }
}
</script>

<style scoped>
</style>