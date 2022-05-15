<template>
  <div class="testKitPage">
    <div class="testKitPageBar">
      <div class="pageTitle">
        <h1>現有快篩試劑列表</h1>
      </div>
      <div class="pageTabs">
        <div
          class="tab"
          :class="{ active: currentTab === 'text' }"
          @click="changeTabText()"
        >
          文字列表
        </div>
        <div
          class="tab"
          :class="{ active: currentTab === 'map' }"
          @click="changeTabMap()"
        >
          地圖顯示
        </div>
      </div>
    </div>
    <div class="testKitComponent">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
/* vue module */
import { ref } from "vue";
/* services */
import {
  redirectToShowInText,
  redirectToShowInMap,
} from "@/services/Redirect.service";

const currentTab = ref("");

const changeTabText = () => {
  currentTab.value = "text";
  redirectToShowInText();
};
const changeTabMap = () => {
  currentTab.value = "map";
  redirectToShowInMap();
};
</script>
<style lang="scss" scoped>
.testKitPage {
  padding: 0;
  margin: 0;
  .testKitPageBar {
    background-color: #262626;
    .pageTitle {
      text-align: center;
      > h1 {
        padding: 10px 0;
        margin: 0;
        color: whitesmoke;
      }
    }
    .pageTabs {
      display: flex;
      justify-content: center;
      align-items: center;
      .tab {
        background-color: #262626;
        width: 100%;
        padding: 10px 0;
        transition: 0.25s ease-in-out;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        text-align: center;
        font-size: 24px;
        font-weight: 600;
        letter-spacing: 1px;
        color: whitesmoke;
      }
      .tab:hover,
      .tab.active {
        background-color: whitesmoke;
        color: #262626;
      }
    }
  }
}
</style>
<!-- https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv -->
