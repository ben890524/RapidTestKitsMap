<template>
  <div class="textShowPage">
    <div class="textShowFilterBar">
      <div class="filter">
        <div class="filterItem">
          <span>縣市：</span>
          <div class="filterItemSelect">
            <select
              name="county"
              id="county"
              @change="filterChangeHandler()"
              v-model="targetFilterDataCountyNameIndex"
            >
              <option value="-1" selected>請選擇</option>
              <option
                v-for="(filterCounty, index) in filterData"
                :key="filterCounty.countyName"
                :value="index"
              >
                {{ filterCounty.countyName }}
              </option>
            </select>
          </div>
        </div>
        <div class="filterItem">
          <span>區域：</span>
          <div class="filterItemSelect">
            <select
              name="section"
              id="section"
              v-model="targetFilterDataCountySectionIndex"
            >
              <option value="-1" selected>請選擇</option>
              <option
                v-for="(filterSection, index) in targetFilterData.countySection"
                :value="index"
              >
                {{ filterSection }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="button">
        <button @click="executeFilter()">確認篩選</button>
        <button @click="clearFilter()">顯示全部</button>
      </div>
    </div>
    <div class="textShowItemCount">
      <span>共 {{ showOpenData.length }} 筆資料</span>
    </div>
    <div class="textShow" id="textShow">
      <div class="filterNoTarget" v-if="showOpenData.length === 0">
        <span>所查區域無庫存！</span>
      </div>
      <TextShowItem
        v-else
        v-for="openDataElement in showOpenData"
        :key="openDataElement.id"
        :openDataElement="openDataElement"
        :openDataRefreshTime="openDataRefreshTime"
      />
    </div>
  </div>
  <loadingScreen
    :isNowLoading="isNowLoading"
    :isNowAutoUpdating="isNowAutoUpdating"
  />
</template>
<script setup lang="ts">
/* static file */
import TaiwanNationSection from "@/assets/static/TaiwanNationSection.json";
/* vue module */
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
/* services */
import { getOpenDataJson } from "@/services/Convert.opendata";
/* interfaces */
import OpenData from "@/interfaces/OpenData";
import FilterData from "@/interfaces/FilterData";
/* components */
import TextShowItem from "@/components/TextShowItem.vue";
import loadingScreen from "@/components/loadingScreen.vue";

const filterDefaultIndex = ref<number>(-1);
const filterDefaultString = ref<string>("");
const filterData = reactive<FilterData[]>(TaiwanNationSection);
const autoUpdateIntervalForOneMinute = ref<number>(60000);

let allOpenData = ref<OpenData[]>([]);
let showOpenData = ref<OpenData[]>([]);
let autoUpdateOpenData = ref<OpenData[]>([]);
let openDataRefreshTime = ref<string>("");
let targetFilterDataCountyNameIndex = ref<number>(-1);
let targetFilterDataCountySectionIndex = ref<number>(-1);
let targetFilterData = ref<FilterData>({ countyName: "", countySection: [] });
let filterString = ref<string>("");
let isNowLoading = ref<boolean>(false);
let isNowAutoUpdating = ref<boolean>(false);
let autoUpdateIntervalTimerId = ref<number>(0);

const setDefaultCountyNameIndex = () => {
  targetFilterDataCountyNameIndex.value = filterDefaultIndex.value;
};
const setDefaultCountySectionIndex = () => {
  targetFilterDataCountySectionIndex.value = filterDefaultIndex.value;
};
const setDefaultShowOpenData = async () => {
  allOpenData.value = await getOpenDataJson();
  showOpenData.value = allOpenData.value;
};
const setDefaultTargetFilterData = () => {
  targetFilterData.value = { countyName: "", countySection: [] };
};
const setDefaultFilterString = () => {
  filterString.value = filterDefaultString.value;
};
const setIsNowLoading = () => {
  isNowLoading.value = true;
};
const setIsNotNowLoading = () => {
  isNowLoading.value = false;
};
const setIsAutoUpdating = () => {
  isNowAutoUpdating.value = true;
};
const setIsNotAutoUpdating = () => {
  isNowAutoUpdating.value = false;
};
const setOpenDataRefreshTime = () => {
  const currentDate = new Date();
  openDataRefreshTime.value = `${currentDate.toDateString()} ${currentDate
    .toTimeString()
    .substring(0, 8)}`;
};
const filterChangeHandler = () => {
  if (targetFilterDataCountyNameIndex.value > -1) {
    targetFilterData.value = filterData[targetFilterDataCountyNameIndex.value];
    setDefaultCountySectionIndex();
  } else {
    setDefaultCountyNameIndex();
    setDefaultCountySectionIndex();
    setDefaultFilterString();
  }
};
const findFilterInAllOpenData = () => {
  showOpenData.value = allOpenData.value.filter((openDataElement) => {
    return openDataElement.address.includes(filterString.value);
  });
};
const executeFilter = () => {
  if (
    targetFilterDataCountyNameIndex.value !== filterDefaultIndex.value &&
    targetFilterDataCountySectionIndex.value !== filterDefaultIndex.value
  ) {
    setIsNowLoading();
    filterString.value = `${
      filterData[targetFilterDataCountyNameIndex.value].countyName
    }${
      filterData[targetFilterDataCountyNameIndex.value].countySection[
        targetFilterDataCountySectionIndex.value
      ]
    }`;
    findFilterInAllOpenData();
    setIsNotNowLoading();
  }
};
const clearFilter = async () => {
  setIsNowLoading();
  setDefaultCountyNameIndex();
  setDefaultCountySectionIndex();
  setDefaultTargetFilterData();
  setDefaultFilterString();
  await setDefaultShowOpenData();
  setIsNotNowLoading();
};
const autoUpdateNewShowOpendata = () => {
  showOpenData.value = autoUpdateOpenData.value;
};
const autoUpdateCompareShowOpenData = async () => {
  setIsAutoUpdating();
  allOpenData.value = await getOpenDataJson();
  autoUpdateOpenData.value = await getOpenDataJson();
  setOpenDataRefreshTime();
  autoUpdateOpenData.value = autoUpdateOpenData.value.filter(
    (openDataElement) => {
      return openDataElement.address.includes(filterString.value);
    }
  );
  if (
    !(
      JSON.stringify(showOpenData.value) ===
      JSON.stringify(autoUpdateOpenData.value)
    )
  ) {
    autoUpdateNewShowOpendata();
  }
  setIsNotAutoUpdating();
};
const setAutoUpdateTimer = () => {
  autoUpdateIntervalTimerId.value = window.setInterval(
    async () => await autoUpdateCompareShowOpenData(),
    autoUpdateIntervalForOneMinute.value
  );
};
const clearAutoUpdateTimer = () => {
  window.clearInterval(autoUpdateIntervalTimerId.value);
};
onMounted(async () => {
  setIsNowLoading();
  allOpenData.value = await getOpenDataJson();
  showOpenData.value = allOpenData.value;
  setOpenDataRefreshTime();
  setOpenDataRefreshTime();
  setIsNotNowLoading();
  setAutoUpdateTimer();
});
onBeforeUnmount(() => {
  clearAutoUpdateTimer();
});
</script>

<style lang="scss" scoped>
.textShowPage {
  background-color: var(--app-main-color);
  padding: 5px 10px;
  .textShowFilterBar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .filter {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .filterItem {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        padding: 2.5px 5px;
        font-weight: bold;
        font-size: 16px;
        .filterItemSelect {
          position: relative;
          display: flex;
          width: 90px;
          height: 30px;
          border-radius: 0.25em;
          overflow: hidden;
          select {
            height: 30px;
            min-height: 30px;
            max-height: 30px;
            appearance: none;
            outline: 0;
            border: 0;
            box-shadow: none;
            flex: 1;
            padding: 0 1em;
            color: whitesmoke;
            background-color: #6f95bb;
            background-image: none;
            cursor: pointer;
          }
        }
        .filterItemSelect::after {
          content: "\25BC";
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 30px;
          min-width: 20px;
          min-height: 30px;
          max-width: 20px;
          max-height: 30px;
          padding: 7.5px 0 5px 5px;
          background-color: rgb(92, 131, 169);
          transition: 0.25s all ease;
          pointer-events: none;
        }
        /* Transition */
        .filterItemSelect:hover::after {
          color: #192d5a;
        }
      }
    }
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      button {
        outline: none;
        color: whitesmoke;
        background-color: #6f95bb;
        padding: 7.5px 10px;
        margin-left: 20px;
        border-radius: 8px;
        border: none;
        transition: 0.125s ease-in;
      }
      button:hover {
        background-color: rgb(92, 131, 169);
      }
      button:active {
        background-color: #192d5a;
      }
    }
  }
  .textShowItemCount {
    padding: 5px 10px 5px 0;
    text-align: right;
    font-weight: 600;
    font-style: italic;
    text-decoration: underline;
  }
  .textShow {
    height: calc(
      var(--mobileHeight)
    ); // define in /index.html resize function to solve mobile container 100vh problem
    overflow-x: hidden;
    overflow-y: auto;
    margin-right: 5px;
    border-radius: 8px;
    &::-webkit-scrollbar {
      width: 10px;
    }
    /* Track */
    &::-webkit-scrollbar-track {
      border-radius: 8px;
      box-shadow: inset 0 0 5px grey;
      background-color: white;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background-clip: content-box;
      border-radius: 9999px;
      background-color: #aaaaaa;
    }
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #767676;
    }
    .filterNoTarget {
      height: 100%;
      position: relative;
      span {
        position: absolute;
        top: 40%;
        left: calc(50% + 5px);
        transform: translate(-50%, -50%);
        width: fit-content;
        font-size: 30px;
        font-weight: 600;
        color: red;
      }
    }
    .openDataElement:first-child {
      margin-top: 0;
    }
  }
}
@media screen and (min-width: 503px) {
  .textShowPage {
    .textShowFilterBar {
      .button {
        margin-top: 0px;
      }
    }
  }
}
@media screen and (min-width: 768px) {
  .textShowPage {
    padding: 5px 12.5px 5px 15px;
    .textShowFilterBar {
      .filter {
        .filterItem {
          font-size: 20px;
          .filterItemSelect {
            transition: 0.125s ease;
            width: 120px;
          }
          .filterItemSelect::after {
            width: 25px;
            min-width: 25px;
            max-width: 25px;
            padding: 5px 0 5px 5px;
          }
        }
      }
    }
    .textShowItemCount {
      padding: 5px 35px 5px 0;
    }
    .textShow {
      height: calc(100vh - 177px);
      padding-left: 20px;
      margin-right: 25px;
    }
  }
}
@media screen and (min-width: 1024px) {
  .textShowPage {
    .textShowItemCount {
      padding: 5px 55px 5px 0;
    }
    .textShow {
      padding-left: 40px;
      margin-right: 45px;
    }
  }
}
@media screen and (min-width: 1440px) {
  .textShowPage {
    .textShowItemCount {
      padding: 5px 65px 5px 0;
    }
    .textShow {
      padding-left: 50px;
      margin-right: 55px;
    }
  }
}
</style>
