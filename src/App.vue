<template>
  <div id="app">
    <GameStage />
  </div>
</template>

<script>
import GameStage from './components/GameStage';
export default {
  name: 'app',
  components: {
    GameStage
  }
};
</script>

<style>
@import url('./assets/css/base.css');
#app {
  background-color: black;
}
</style>
