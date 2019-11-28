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
#app {
  background-color: black;
}
</style>
