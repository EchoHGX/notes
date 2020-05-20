<template>
  <div class="app-container">
    <mt-text></mt-text>
    Vue-simple-cli by webpack
  </div>
</template>

<script>
import mtText from '@/my-tui/mt-text/inex'
// console.log('rocess.env.NODE_ENV',process.env.NODE_ENV)
  export default {
    name: 'App',
    created(){
      console.log('webpack-vue-cli')
    },
    components: {
      'mt-text': mtText
    }
  }
</script>

<style lang="scss" scoped>
.app-container{
  display: flex;
  font-size: 20px;
  color: burlywood;
}
</style>