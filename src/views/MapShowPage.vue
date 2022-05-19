<template>
  <div class="mapShowPage">
    <div class="mapShowFilterBar">
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
        <button @click="executeFilter()">確認移動</button>
      </div>
    </div>
    <ol-map
      class="mapShow"
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
    >
      <ol-view
        ref="view"
        :center="mapCenter"
        :rotation="rotation"
        :zoom="zoomSize"
        :projection="projection"
        :minZoom="10"
        :maxZoom="20"
      />

      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
      <ol-overlay
        v-for="openDataElement in allOpenData"
        :position="[openDataElement.longitude, openDataElement.latitude]"
      >
        <div class="mapPin" @click="goTargetCenter(openDataElement)">
          <img :src="pin" alt="" />
        </div>
      </ol-overlay>
    </ol-map>
    <div
      class="openDataElementDetail"
      :class="{ active: isShowingTargetOpenDataElementDetail }"
    >
      <div class="closeOpenDataElementDetail">
        <span @click="setIsNotShowingTargetOpenDataElementDetail">✖</span>
      </div>
      <div class="showTargetDataDetail">
        <table class="openDataTable mobile">
          <tr>
            <th>醫事機構名稱</th>
            <td>{{ targetOpenDataElementDetail.name }}</td>
          </tr>
          <tr>
            <th>醫事機構地址</th>
            <td>
              <div class="tdIcon">
                {{ targetOpenDataElementDetail.address }}
                <a
                  class="googleMapsIcon"
                  target="_blank"
                  :href="`https://www.google.com/maps?q=${targetOpenDataElementDetail.name}+${targetOpenDataElementDetail.address}`"
                >
                  <img :src="googleMapsIcon" alt="" />
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <th>醫事機構電話</th>
            <td>{{ targetOpenDataElementDetail.phone }}</td>
          </tr>
          <tr>
            <th>更新時間</th>
            <td>{{ openDataRefreshTime }}</td>
          </tr>
          <tr>
            <th>廠牌</th>
            <td class="important">
              {{ targetOpenDataElementDetail.manufacturer }}
            </td>
          </tr>
          <tr>
            <th>剩餘存貨數量</th>
            <td class="important">
              {{ targetOpenDataElementDetail.stock }} 份
            </td>
          </tr>
          <tr>
            <th>備註</th>
            <td>{{ targetOpenDataElementDetail.remark }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <loadingScreen :isNowLoading="isNowLoading" />
</template>
<script setup lang="ts">
/* static file */
import TaiwanNationSection from "@/assets/static/TaiwanNationSection.json";
import TaiwanNationSectionLongitudeAndLatitude from "@/assets/static/TaiwanNationSectionLongitude&Latitude.json";
/* import img */
import pin from "@/assets/img/pin.png";
import googleMapsIcon from "@/assets/img/GoogleMapsIcon.svg";
/* vue module */
import { ref, reactive, onMounted } from "vue";
/* services */
import { getOpenDataJson } from "@/services/Convert.opendata";
/* interfaces */
import OpenData from "@/interfaces/OpenData";
import FilterData from "@/interfaces/FilterData";
import LongitudeAndLatitudeData from "@/interfaces/LongitudeAndLatitudeData";
/* components */
import loadingScreen from "@/components/loadingScreen.vue";

const filterDefaultIndex = ref<number>(-1);
const filterData = reactive<FilterData[]>(TaiwanNationSection);
const longitudeAndLatitudeData = reactive<LongitudeAndLatitudeData[]>(
  TaiwanNationSectionLongitudeAndLatitude
);
const mapDefaultCenter = ref<number[]>([121.512, 25.04]);
const projection = ref<string>("EPSG:4326");
const zoomSize = ref(17);
const rotation = ref(0);
const defaultOpenDataElementDetail = ref<OpenData>({
  id: "",
  name: "",
  address: "",
  longitude: 0,
  latitude: 0,
  phone: "",
  manufacturer: "",
  stock: "",
  datatime: "",
  remark: "",
});
const defaultCenterPadding = 0.0021;

let openDataRefreshTime = ref<string>("");
let targetFilterDataCountyNameIndex = ref<number>(-1);
let targetFilterDataCountySectionIndex = ref<number>(-1);
let targetFilterData = ref<FilterData>({ countyName: "", countySection: [] });
let filterLongitudeAndLatitude = ref<number[]>([121.512, 25.04]);
let allOpenData = ref<OpenData[]>([]);
let mapCenter = ref(mapDefaultCenter);
let isShowingTargetOpenDataElementDetail = ref<boolean>(false);
let isNowLoading = ref<boolean>(false);
let targetOpenDataElementDetail = ref<OpenData>(
  defaultOpenDataElementDetail.value
);

const setIsNowLoading = () => {
  isNowLoading.value = true;
};
const setIsNotNowLoading = () => {
  isNowLoading.value = false;
};
const setOpenDataRefreshTime = () => {
  const currentDate = new Date();
  openDataRefreshTime.value = `${currentDate.toDateString()} ${currentDate
    .toTimeString()
    .substring(0, 8)}`;
};
const setDefaultCountyNameIndex = () => {
  targetFilterDataCountyNameIndex.value = filterDefaultIndex.value;
};
const setDefaultCountySectionIndex = () => {
  targetFilterDataCountySectionIndex.value = filterDefaultIndex.value;
};
const setDefaultFilterLongitudeAndLatitude = () => {
  filterLongitudeAndLatitude.value = mapDefaultCenter.value;
};
const setTargetOpenDataElementDetail = (openDataElement: OpenData) => {
  targetOpenDataElementDetail.value = openDataElement;
};
const setDefaultMapCenter = () => {
  mapCenter.value = mapDefaultCenter.value;
};
const clearTargetOpenDataElementDetail = () => {
  targetOpenDataElementDetail.value = defaultOpenDataElementDetail.value;
};
const setIsShowingTargetOpenDataElementDetail = () => {
  isShowingTargetOpenDataElementDetail.value = true;
};
const setIsNotShowingTargetOpenDataElementDetail = () => {
  clearTargetOpenDataElementDetail();
  isShowingTargetOpenDataElementDetail.value = false;
};
const goTargetCenter = (openDataElement: OpenData) => {
  mapCenter.value = [
    openDataElement.longitude,
    openDataElement.latitude - defaultCenterPadding,
  ];
  zoomSize.value = 17;
  setTargetOpenDataElementDetail(openDataElement);
  setIsShowingTargetOpenDataElementDetail();
};
const filterChangeHandler = () => {
  if (targetFilterDataCountyNameIndex.value > -1) {
    targetFilterData.value = filterData[targetFilterDataCountyNameIndex.value];
    setDefaultCountySectionIndex();
  } else {
    setDefaultCountyNameIndex();
    setDefaultCountySectionIndex();
    setDefaultFilterLongitudeAndLatitude();
  }
};

const executeFilter = () => {
  if (
    targetFilterDataCountyNameIndex.value !== filterDefaultIndex.value &&
    targetFilterDataCountySectionIndex.value !== filterDefaultIndex.value
  ) {
    filterLongitudeAndLatitude.value =
      longitudeAndLatitudeData[
        targetFilterDataCountyNameIndex.value
      ].longitudeAndLatitude[targetFilterDataCountySectionIndex.value];
    mapCenter.value = filterLongitudeAndLatitude.value;
    setIsNotShowingTargetOpenDataElementDetail();
  }
};
const getUserCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        mapCenter.value = [position.coords.longitude, position.coords.latitude];
      },
      () => {
        setDefaultMapCenter();
      }
    );
  } else {
  }
};
onMounted(async () => {
  getUserCurrentLocation();
  setIsNowLoading();
  allOpenData.value = await getOpenDataJson();
  setOpenDataRefreshTime();
  setIsNotNowLoading();
  navigator.geolocation.getCurrentPosition;
});
</script>

<style lang="scss" scoped>
.mapShowPage {
  position: relative;
  .mapShowFilterBar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px 0;
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
        font-size: 14px;
        .filterItemSelect {
          position: relative;
          display: flex;
          width: 75px;
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
            padding: 0 0.5em;
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
      margin-top: 0px;
      button {
        outline: none;
        color: whitesmoke;
        background-color: #6f95bb;
        padding: 7.5px 5px;
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
  div.mapShow {
    height: calc(var(--mobileHeightForMap));
    transition: 0.25s all;
  }
  .mapPin {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 999rem;
    transition: 0.25s ease-in;
    background-color: transparent;
    img {
      width: 100%;
      background: transparent;
    }
  }
  .mapPin:hover {
    background-color: #002255;
  }
  .mapPin:active {
    background-color: #002255;
  }
  .openDataElementDetail {
    position: absolute;
    width: 100%;
    height: fit-content;
    max-width: 750px;
    overflow-x: hidden;
    overflow-y: auto;
    right: 0;
    bottom: 0;
    background: rgba($color: var(--app-main-color-rgb), $alpha: 0.85);
    transform: translateX(100%);
    transition: 0.25s ease-in-out;
    border-radius: 8px;
    .closeOpenDataElementDetail {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0px 7.5px;
      font-size: 20px;
      font-weight: 600;
      span {
        cursor: pointer;
        padding: 2.5px 5px;
        transition: 0.5s all;
      }
      span:hover {
        transform: rotate(180deg);
      }
    }
    .showTargetDataDetail {
      padding: 5px 10px;
      border-radius: 8px;
      table.openDataTable {
        width: 100%;
        border-spacing: 0;
        border: 0.5px solid var(--table-table-border-color);
        tr {
          border: 0.5px solid var(--table-table-border-color);
          td,
          th {
            border: 0.5px solid var(--table-table-border-color);
          }
          > th {
            background-color: var(--table-th-color);
          }
          .important {
            color: red;
            font-weight: 600;
          }
          .tdIcon {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .googleMapsIcon {
              height: 25px;
              padding: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
              text-decoration: none;
              img {
                padding: 5px 0 5px 5px;
                height: 100%;
              }
            }
          }
        }
      }
      table.openDataTable.mobile {
        display: table;
        font-size: 14px;
        tr {
          td,
          th {
            border: 0.5px solid var(--table-table-border-color);
          }
          th {
            font-size: 13px;
            padding: 0.25rem 0.25rem;
            width: 25%;
            min-width: 25%;
            max-width: 25%;
          }
          td {
            padding: 0.25rem 0.5rem;
            background-color: var(--table-background-color);
          }
        }
      }
    }
  }
  .openDataElementDetail.active {
    transform: translateX(0);
  }
}
@media screen and (min-width: 375px) {
  .mapShowPage {
    .mapShowFilterBar {
      .filter {
        .filterItem {
          .filterItemSelect {
            width: 90px;
          }
        }
      }
      .button {
        margin-left: 5px;
        button {
          padding: 7.5px 10px;
        }
      }
    }
  }
}
@media screen and (min-width: 503px) {
  .mapShowPage {
    .mapShowFilterBar {
      .filter {
        .filterItem {
          .filterItemSelect {
            width: 100px;
            select {
              padding: 0 1rem;
            }
          }
        }
      }
      .button {
        margin-left: 15px;
        button {
          padding: 7.5px 12.5px;
        }
      }
    }
  }
}
@media screen and (min-width: 768px) {
  .mapShowPage {
    .mapShowFilterBar {
      padding: 10px 0;
      .filter {
        .filterItem {
          .filterItemSelect {
            width: 120px;
          }
        }
      }
    }
    div.mapShow {
      cursor: grab;
      height: calc(100vh - 154px);
    }
    div.mapShow:active {
      cursor: grabbing;
    }
  }
}
</style>
