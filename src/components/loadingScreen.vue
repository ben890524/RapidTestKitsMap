<template>
  <div class="loadingScreen" v-if="isNowLoading">
    <div class="loadingSpinner">
      <img :src="loadingSpinner" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts">
/* import img */
import loadingSpinner from "@/assets/img/spinner.gif";
const props = defineProps({
  isNowLoading: {
    type: Boolean,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.loadingScreen {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba($color: #000000, $alpha: 0.5);
  .loadingSpinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 75px;
    height: 75px;
    > img {
      width: 100%;
    }
  }
}
</style>
