<template>
  <div class="loadingScreen" v-if="isNowLoading">
    <div class="loadingSpinner">
      <div class="loadingSpinnerImg">
        <img :src="loadingSpinner" alt="" />
      </div>
    </div>
  </div>
  <div class="loadingScreen" v-else-if="isNowAutoUpdating">
    <div class="loadingSpinner">
      <div class="loadingSpinnerImg">
        <img :src="loadingSpinner" alt="" />
      </div>
      <div class="autoUpdateNotice">
        每分鐘自動更新<br />
        自動更新資料中...
      </div>
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
  isNowAutoUpdating: {
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
    .loadingSpinnerImg {
      width: 75px;
      height: 75px;
      margin: auto;
      > img {
        width: 100%;
      }
    }
    .autoUpdateNotice {
      width: 125px;
      color: whitesmoke;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
    }
  }
}
</style>
