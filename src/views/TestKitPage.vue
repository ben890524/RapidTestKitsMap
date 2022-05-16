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
import { onMounted, ref } from "vue";
/* services */
import {
  redirectToShowInText,
  redirectToShowInMap,
} from "@/services/Redirect.service";

const currentTab = ref("");
const initCheckRouter = () => {
  if (window.location.href.includes("textshow")) currentTab.value = "text";
  if (window.location.href.includes("mapshow")) currentTab.value = "map";
};
const changeTabText = () => {
  currentTab.value = "text";
  redirectToShowInText();
};
const changeTabMap = () => {
  currentTab.value = "map";
  redirectToShowInMap();
};
onMounted(() => {
  initCheckRouter();
});
</script>
<style lang="scss" scoped>
.testKitPage {
  padding: 0;
  margin: 0;
  .testKitPageBar {
    background-color: var(--app-sub-color);
    .pageTitle {
      text-align: center;
      > h1 {
        padding: 5px 0;
        margin: 0;
        font-size: 22px;
        color: #042A2B;
      }
    }
    .pageTabs {
      display: flex;
      justify-content: center;
      align-items: center;
      .tab {
        background-color: var(--app-sub-color);
        width: 100%;
        padding: 5px 0;
        transition: 0.25s ease-in-out;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        color: var(--app-main-color);
      }
      .tab:hover,
      .tab.active {
        background-color: var(--app-main-color);
        color: var(--app-sub-color);
      }
    }
  }
}

@media screen and (min-width: 503px) {
  .testKitPage {
    .testKitPageBar {
      .pageTitle {
        > h1 {
          padding: 10px 0;
        }
      }
      .pageTabs {
        .tab {
          padding: 10px 0;
        }
      }
    }
  }
}
@media screen and (min-width: 768px) {
  .testKitPage {
    .testKitPageBar {
      .pageTitle {
        > h1 {
          font-size: 24px;
        }
      }
      .pageTabs {
        .tab {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
<!-- https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv -->
